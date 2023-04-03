import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

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

interface SpotifyFullAlbumData {
  albums: {
    href: string;
    items: {
      id: string;
      name: string;
      album_group: string;
      album_type: string;
      artists: {
        external_urls: { spotify: string };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
      available_markets: [];
      external_urls: { spotify: string };
      href: string;
      images: {
        height: number;
        url: string;
        width: number;
      }[];
      release_date: string;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
      isPlayable: boolean;
    }[];
    limit: number;
    offset: number;
    previous: null;
    total: number;
  };
}

export const tracksRouter = createTRPCRouter({
  getAlbums: publicProcedure.query(async ({ ctx }) => {
    const token = await spotifyToken();
    console.log(token);

    const artist = "Tyler The Creator";

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=album&include_external=audio&q=${artist}`,
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

    return data.albums.items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        type: item.album_type,
        artist: item.artists?.[0]?.name,
        cover_art_url: item.images?.[0]?.url,
        release_date: item.release_date,
        total_tracks: item.total_tracks,
      };
    });
  }),
});
