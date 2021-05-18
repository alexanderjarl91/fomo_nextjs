import "../styles/globals.css";
import Head from "next/head";

import { UsersProvider } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <Head>
        <title>fomo.</title>
        <meta name="description" content="Events around you" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </UsersProvider>
  );
}

export default MyApp;
