import React, { useState, useEffect, useContext } from "react";

import Head from 'next/head'
import styles from '../styles/Index.module.css'

import { UsersContext, DataContext } from "../context";

//components
import Navbar from '../components/Navbar'
import Menu from '../components/Menu'
import EventCards from '../components/EventCards'
import Buttons from '../components/Buttons'
import Filter from "../components/Filter";

export default function Home() {
  //context data
  const { showMenu, setShowMenu, showFilter} = useContext(UsersContext);


  // GET USERS POSITION ON MOUNT (maybe handled in context?)
  useEffect(() => {
    //check if location is allowed
    if ("geolocation" in navigator) {
      console.log("Available");
    } else {
      console.log("Not Available");
    }
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
    }, (err) => console.log('err:', err), {maximumAge:60000, timeout:5000, enableHighAccuracy:true})
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>fomo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      {/* NAVBAR & MENU */}
      <Navbar showMenu={showMenu} setShowMenu={setShowMenu} />

      
      {/* EVENT CARDS */}
      <EventCards />

      {/* BUTTONS */}
      <Buttons />

      {/* FILTER */}
      {showFilter&& <Filter/>}
      



    </div>
  )
}
