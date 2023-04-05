import { type NextPage } from "next";

import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { LoadingPage } from "~/components/loading";
import Track from "~/components/tracks";

//put trending albums at the front then allow search for albums and songs

const TrackView = () => {
  const { data, isLoading: albumsLoading } = api.tracks.getAlbums.useQuery();

  if (albumsLoading) return <LoadingPage />;

  if (!data) return <div />;

  return (
    <div className="grid auto-cols-fr gap-3 p-2 md:grid-cols-1 md:place-items-center lg:grid-cols-3">
      {data?.map((album) => {
        return <Track {...album} key={album.id} />;
      })}
    </div>
  );
};

const Home: NextPage = () => {
  api.tracks.getAlbums.useQuery();

  return (
    <PageLayout>
      <div>
        <h1 className="px-4 py-2 text-2xl font-extrabold tracking-tight lg:text-3xl">
          Currently Trending
        </h1>
      </div>
      <TrackView />
    </PageLayout>
  );
};

export default Home;
