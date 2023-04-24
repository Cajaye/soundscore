import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { Album, SpotifyFullAlbumData } from "~/types/album";
import simplifyAlbumData from "~/server/helpers/simplifyAlbumData";
import calcsoundscore from "~/server/helpers/soundscore";
import spotifyToken from "~/server/helpers/spotifyToken";

export const tracksRouter = createTRPCRouter({
  getAlbums: publicProcedure.query(async () => {
    const token = await spotifyToken();

    const response = await fetch(
      `https://api.spotify.com/v1/browse/new-releases`,
      {
        headers: {
          Authorization: "Bearer " + token.access_token,
          "Content-type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    const data = (await response.json()) as SpotifyFullAlbumData;

    return simplifyAlbumData(data.albums.items);
  }),

  getSingleAlbum: publicProcedure
    .input(z.object({ albumId: z.string() }))
    .query(async ({ ctx, input }) => {
      const token = await spotifyToken();

      const response = await fetch(
        `https://api.spotify.com/v1/albums/${input.albumId}`,
        {
          headers: {
            Authorization: "Bearer " + token.access_token,
            "Content-type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const data = (await response.json()) as Album;

      const rate = await ctx.prisma.rate.findMany({
        where: {
          album: input.albumId,
        },
      });

      const soundscore = calcsoundscore(rate);

      return {
        id: data.id,
        name: data.name,
        link: data.external_urls.spotify,
        artist: data.artists[0]?.name,
        score: soundscore, //score and ratings from prisma
        ratings: rate.length,
        release_date: data.release_date,
        total_tracks: data.total_tracks,
        image: data.images[0]?.url,
        tracks: data.tracks.items.map((item) => {
          return {
            id: item.id,
            href: `/tracks/${item.id}`,
            name: item.name,
            type: item.type,
            release_date: data.release_date,
            total_tracks: 0,
            artist: item.artists
              .flat()
              .map((artist) => artist.name)
              .join(", "),
            cover_art_url: data.images[0]?.url,
          };
        }),
      };
    }),
  rateAlbum: privateProcedure
    .input(
      z.object({
        album: z.string(),
        review: z.string().min(10).max(300),
        rateType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      //rate limiter

      const findPrevRate = await ctx.prisma.rate.findFirst({
        where: {
          userId,
          album: input.album,
        },
      });

      if (findPrevRate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot vote twice",
        });
      }

      //allow user to edit vote

      const rate = await ctx.prisma.rate.create({
        data: {
          userId,
          album: input.album,
          review: input.review,
          rateType: input.rateType,
        },
      });

      return rate;
    }),
});
