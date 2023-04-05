import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/layout";
import ssgHelper from "~/helpers/ssgHelper";
import { api } from "~/utils/api";
import Image from "next/image";
import { Icons } from "~/components/icons";
import { date } from "zod";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

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
            <div className="border border-slate-600 bg-slate-800">
              <div className="flex w-full cursor-pointer items-center gap-6 rounded-md">
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
                <div className="w-full text-center">
                  <p className="text-sm font-bold">({data.release_date})</p>
                  <p className="text-2xl font-bold">{data.name}</p>
                  <p className="pb-2 text-lg font-semibold">{data.artist}</p>
                  <div className="flex items-center justify-center">
                    <Icons.logo className="mr-2 h-4 w-4" />
                    <p className="text-sm">Soundscore - {data.score}%</p>
                  </div>
                  <p className="text-sm">Ratings - {data.ratings}</p>
                </div>
              </div>
            </div>
                      <div className="mt-4">
                          <div className="mb-2">
                              <p>Would you like to rate this album?</p>
                          </div>
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

  if (typeof id !== "string") {
    throw new Error("Album does not exist");
  }

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
