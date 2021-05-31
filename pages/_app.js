import "../styles/globals.css";
import Head from "next/head";
import { DataProvider, UsersProvider } from "../context";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <DataProvider>
        <Head>
          <title>fomo.</title>
          <meta name="description" content="Events around you" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
          />
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2WN37oJn1RxGfx5ltyGDGZZ7gzGaGFM8&libraries=places"></script>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataProvider>
    </UsersProvider>
  );
}

export default MyApp;
