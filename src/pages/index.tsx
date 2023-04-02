import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton } from "@clerk/nextjs";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>soundscore</title>
        <meta name="description" content="music rating" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
         <SignInButton mode="modal">
  <button className="btn">
    Sign in
  </button>
</SignInButton>
        </div>
      </main>
    </>
  );
};

export default Home;
