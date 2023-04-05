export interface SpotifyFullAlbumData {
  albums: {
    href: string;
    items: {
      id: string;
      name: string;
      album_group: string;
      album_type: string;
      artists: Artist[];
      available_markets: [];
      external_urls: ExternalUrls;
      href: string;
      images: Image[];
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

interface ExternalUrls {
  spotify: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}
interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Track {
  artists: [Artist[]];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}

export interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  copyrights: {
    text: string;
    type: string;
  }[];
  external_ids: { upc: string }[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  genres: [];
  images: Image[];
  name: string;
  label: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  limit: number;
  next: null;
  offset: number;
  previous: null;
  total: number;
  type: string;
  uri: string;
  tracks: {
    items: Track[];
  };
}
