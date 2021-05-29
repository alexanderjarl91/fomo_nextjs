import "../styles/globals.css";
import Head from "next/head";
import { DataProvider, UsersProvider } from "../context";

function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <DataProvider>
        <Head>
          <title>fomo.</title>
          <meta name="description" content="Events around you" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </DataProvider>
    </UsersProvider>
  );
}

export default MyApp;
