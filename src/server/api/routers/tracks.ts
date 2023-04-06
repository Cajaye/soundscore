import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { Album, SpotifyFullAlbumData } from "~/types/album";

const spotifyToken = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID as string;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;

  const token = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",

      Accept: "application/json",

      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const t = (await token.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  return t;
};

const simplifyAlbumData = (items: SpotifyFullAlbumData["albums"]["items"]) => {
  return items.map((item) => {
    return {
      id: item.id,
      href: `/albums/${item.id}`,
      name: item.name,
      type: item.album_type,
      artist: item.artists?.[0]?.name,
      cover_art_url: item.images?.[0]?.url,
      release_date: item.release_date,
      total_tracks: item.total_tracks,
    };
  });
};

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

      const fire = rate.filter((r) => r.rateType === "fire").length;
      const mid = rate.filter((r) => r.rateType === "mid").length;
      const trash = rate.filter((r) => r.rateType === "trash").length;

      const total = fire + mid + trash;
      const soundscore: number = isNaN(Math.floor((fire / total) * 100))
        ? 0
        : Math.floor((fire / total) * 100);

      return {
        id: data.id,
        name: data.name,
        link: data.external_urls.spotify,
        artist: data.artists[0]?.name,
        score: soundscore, //score and ratings from prisma
        ratings: total,
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
});
