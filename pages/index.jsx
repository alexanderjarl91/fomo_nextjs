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


  //ANIMATION
  //add animation if user is in mobile
  let boxVariants = {}
  if (typeof window !== "undefined") {
    const isMobile = window.innerWidth < 1200; //Add the width you want to check for here (now 768px)
    console.log('is mobile?', isMobile)
    if (isMobile) {
      boxVariants = {
        initial: { x: '-100%' },
        animate: { x: 0 },
      };
    }
  }


  return (
    <>

      {boxVariants &&
        <motion.div
          variants={boxVariants}
          initial="initial"
          animate="animate"
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
      }
    </>
  );
}
