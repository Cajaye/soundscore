import type { SpotifyFullAlbumData } from "~/types/album";

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
export default simplifyAlbumData;
