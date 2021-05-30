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
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />

        </Head>
        <Component {...pageProps} />
      </DataProvider>
    </UsersProvider>
  );
}

export default MyApp;
