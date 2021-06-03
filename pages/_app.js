import "../styles/globals.css";
import Head from "next/head";
import { DataProvider, UsersProvider } from "../context";
import Layout from "../components/Layout";
import Menu from "../components/Menu";
import styles from "../styles/Menu.module.css";

function MyApp({ Component, pageProps }) {
  return (
    <UsersProvider>
      <DataProvider>
        <Head>
          <title>fomo.</title>
          <meta name="description" content="Events around you" />
          <link rel="icon" href="/favicon.ico" />

          <script
            async
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2WN37oJn1RxGfx5ltyGDGZZ7gzGaGFM8&v=3.exp&libraries=geometry,drawing,places"
          ></script>
        </Head>
        <Layout>
          <div className={styles.docked__menu}>
            <Menu />
          </div>
          <Component {...pageProps} />
        </Layout>
      </DataProvider>
    </UsersProvider>
  );
}

export default MyApp;
