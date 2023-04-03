import { type AppType } from "next/app";
import { ClerkProvider } from '@clerk/nextjs';
import Head from "next/head";
import { Inter as FontSans } from "next/font/google"

import { api } from "~/utils/api";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
     <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
    <ClerkProvider {...pageProps} >
       <Head>
        <title>soundscore</title>
        <meta name="description" content="For music rating" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
      </ClerkProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
