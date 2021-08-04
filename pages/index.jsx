import React, { useContext, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Index.module.css";
import { UsersContext, DataContext } from "../context";
import { motion } from "framer-motion"



//components
import EventCards from "../components/EventCards";
import Filter from "../components/Filter";

export default function Home() {
  //context data
  const { showFilter } = useContext(UsersContext);


  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "calc(100vw - 100%)" }}
      exit={{ x: "-100%" }}
      className={styles.index__container} id="INDEX">
      <Head>
        <title>fomo</title>
        <meta name="description" content="Swipe events in your area!" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* EVENT CARDS & BUTTONS */}
      <EventCards />

      {/* FILTER */}
      {showFilter && <Filter />}





    </motion.div>
  );
}
