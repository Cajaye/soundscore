import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import ssgHelper from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Image from "next/image";
import { Icons } from "~/components/icons";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import Track from "~/components/tracks";

const SingleAlbumPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.tracks.getSingleAlbum.useQuery({ albumId: id });

  if (!data) return <div>No data</div>;

  return (
    <>
      <Head>
        <title>{`Album - ${data?.name ?? ""}`}</title>
      </Head>

      <PageLayout>
        <div className="mx-32">
          <div className="m-4 flex w-full flex-col justify-center">
            <div className="rounded-md border border-slate-600 bg-slate-800">
              <div className="flex cursor-pointer items-center rounded-md">
                <div className="w-full">
                  <Link href={data.link}>
                    <Image
                      src={data.image as string}
                      priority
                      alt={`${data?.name}'s image`}
                      width={400}
                      height={400}
                      className="object-cover"
                    />
                  </Link>
                </div>
                <div className="w-full">
                  <p className="text-xs font-bold">({data.release_date})</p>
                  <p className="text-3xl font-bold">{data.name}</p>
                  <p className="pb-2 text-lg font-semibold">{data.artist}</p>
                  <div className="flex items-center">
                    <Icons.logo className="mr-2 h-4 w-4" />
                    <p className="text-sm">Soundscore - {data.score}%</p>
                  </div>
                  <div className="flex items-center">
                    <Icons.logo className="mr-2 h-4 w-4" />
                    <p className="text-sm">Ratings - {data.ratings}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2">
                <p>Would you like to rate this album?</p>
              </div>
              <form>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rate Scale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fire">Fire</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="trash">Trash</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  className="mt-5"
                  placeholder="Type your message here."
                />
                <Button type="submit" className=" mt-5 bg-white text-black">
                  Submit
                </Button>
              </form>
            </div>
            <div className="mt-5">
              <h2 className="mb-2 text-3xl font-bold">Tracks in this album</h2>
              <div className="flex flex-col gap-2">
                {data.tracks.map((track) => (
                  <Track {...track} key={track.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = ssgHelper();
  const id = context.params?.id as string;

  if (typeof id !== "string") throw new Error("Album does not exist");

  await ssg.tracks.getSingleAlbum.prefetch({ albumId: id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export default SingleAlbumPage;
