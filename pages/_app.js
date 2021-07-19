import "../styles/globals.css";
import Head from "next/head";
import { DataProvider, UsersProvider } from "../context";
import Layout from "../components/Layout";
import Menu from "../components/Menu";
import styles from "../styles/Menu.module.css";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  //google analytics test, trying to
  useEffect(() => {
    const logEvent = (url) => {
      analytics().setCurrentScreen(url);
      analytics().logEvent("screen_view");

      routers.events.on("routeChangeComplete", logEvent);
      //For First Page
      logEvent(window.location.pathname);

      //Remvove Event Listener after un-mount
      return () => {
        routers.events.off("routeChangeComplete", logEvent);
        console.log("routing happened, logging to analytics");
      };
    };
  }, []);

  return (
    <UsersProvider>
      <DataProvider>
        <Head>
          <title>fomo.</title>
          <meta name="description" content="Events around you" />
          <meta
            name="viewport"
            content="initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0,width=device-width"
          />

          <link rel="icon" href="/favicon.ico" />
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
