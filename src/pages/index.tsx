import { type NextPage } from "next";

import { api, type RouterOutputs } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Header from "~/components/header";
import { Icons } from "~/components/icons";
import Image from "next/image";

type CustomSpotifyData = RouterOutputs["tracks"]["getAlbums"][number];

const AlbumView = (props: CustomSpotifyData) => {
  return (
    <div className="m-2 flex sm:flex-col lg:flex-row cursor-pointer items-start space-x-4 rounded-md border border-slate-600 bg-slate-800 hover:bg-slate-900">
      <div className="self-center p-2">
      <Image
        className="object-cover rounded-md align-middle"
        alt={`${props.name}'s cover art`}
        src={props.cover_art_url as string}
          width={100}
          height={100}
        />
        </div>
      <div className="flex flex-col space-y-1 p-2">
        <p className="text-sm font-semibold">{props.artist}</p>
        <p className="text-sm">{`${props.name} - ${props.type}`}</p>
        <div className="flex gap-2 pt-2 items-center">
          <Icons.music className="opacity-70" />
          <p className="text-xs text-slate-400">{props.total_tracks}</p>
        </div>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const { data, isLoading } = api.tracks.getAlbums.useQuery();

  return (
    <PageLayout>
      <Header />
      <div className="grid grid-cols-4 gap-3">
        {data?.map((album) => {
          return <AlbumView {...album} key={album.id} />;
        })}
      </div>
    </PageLayout>
  );
};

export default Home;
