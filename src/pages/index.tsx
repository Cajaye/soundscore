import { type NextPage } from "next";

import { api, type RouterOutputs } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { Icons } from "~/components/icons";
import Image from "next/image";
import Link from "next/link"
import { LoadingPage } from "~/components/loading";

//put trending albums at the front then allow search for albums and songs

type CustomSpotifyData = RouterOutputs["tracks"]["getAlbums"][number];

const Track = (props: CustomSpotifyData) => {
  return (
    <Link href={`albums/${props.id}`} className="w-full flex flex-row cursor-pointer items-start space-x-3 rounded-md border border-slate-600 bg-slate-800 hover:bg-slate-900">
      <div className="self-center p-2">
        <Image
          priority
        className="object-contain rounded-md align-middle w-24 h-24"
        alt={`${props.name}'s cover art`}
        src={props.cover_art_url as string}
          width={100}
          height={100}
        />
        </div>
      <div className="flex flex-col space-y-1 p-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{props.artist}</p>
          </div>
        <p className="text-sm">{`${props.name} - ${props.type}`}</p>
        <div className="flex gap-2 pt-2 items-center">
          <Icons.music className="opacity-70" />
          <p className="text-xs text-slate-400">{props.total_tracks}</p>
        </div>
      </div>
    </Link>
  );
};

const TrackView = () => {
  const { data, isLoading: albumsLoading } = api.tracks.getAlbums.useQuery();
  
  if (albumsLoading) return <LoadingPage />
  
  if(!data) return <div/>

  return (
     <div
        className="grid md:grid-cols-1 lg:grid-cols-3 gap-3 auto-cols-fr md:place-items-center p-2">
        {data?.map((album) => {
          return <Track {...album} key={album.id} />;
        })}
      </div>
  )
}

const Home: NextPage = () => {
  api.tracks.getAlbums.useQuery();

  return (
    <PageLayout>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight lg:text-3xl px-4 py-2">Currently Trending</h1>
      </div>
     <TrackView/>
    </PageLayout>
  );
};

export default Home;
