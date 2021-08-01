import React, {useContext, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Index.module.css";
import { UsersContext, DataContext } from "../context";


//components
import EventCards from "../components/EventCards";
import Filter from "../components/Filter";

export default function Home() {
  //context data
  const { showFilter} = useContext(UsersContext);


  return (
    <div className={styles.index__container} id="INDEX">
      <Head>
        <title>fomo</title>
        <meta name="description" content="Swipe events in your area!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* EVENT CARDS & BUTTONS */}
      <EventCards />

      {/* FILTER */}
      {showFilter && <Filter  />}
       




    </div>
  );
}
