import React, { useContext, useEffect, useState, useRef } from "react";
import fire from "../firebase";
import { UsersContext, DataContext } from "../context";
import { useRouter } from "next/router";
import styles from "../styles/Signup.module.css";

export default function signup({}) {
  const router = useRouter();
  const { signInWithGoogle, showMenu, setShowMenu } = useContext(UsersContext);
  const { isMapsLoaded } = useContext(DataContext);
  //route restriction - if user is logged in, redirect to index
  useEffect(() => {
    if (fire.auth().currentUser) {
      router.push("/");
    }
  }, [fire.auth().currentUser]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (!isMapsLoaded) return; //return if maps is not loaded
    if (!mapRef) return;
    const mapOptions = {
      center: { lat: 10.365365, lng: -66.96667 },
      clickableIcons: false,
      streetViewControl: false,
      panControlOptions: false,
      gestureHandling: "cooperative",
      mapTypeControl: false,
      zoomControlOptions: {
        style: "SMALL",
      },
      zoom: 14,
    };
    console.log(`google`, google);
    new google.maps.Map(mapRef.current, mapOptions);
  }, [isMapsLoaded]);

  return (
    <div>
      {/* PAGE CONTENT */}
      <div className={styles.signup__container}>
        <h1>Sign in</h1>
        <p>
          Sign in with either your Google or Facebook account to discover more
          events and features!
        </p>
        <button
          onClick={() => {
            signInWithGoogle();
          }}
        >
          <img src="/google_icon.svg" alt="" />
          Continue with Google
        </button>

        <button
          onClick={() => {
            // signInWithFacebook();
          }}
        >
          <img src="/facebook_icon.svg" alt="" />
          Continue with Facebook
        </button>
      </div>
      <div id="map" className={styles.map} ref={mapRef}></div>
    </div>
  );
}
