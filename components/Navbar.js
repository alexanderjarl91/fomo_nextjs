import React, { useState, useEffect } from "react";
import Image from "next/image";
import fire from "../firebase";

import styles from "../styles/Navbar.module.css";

export default function Navbar({ setShowMenu, showMenu }) {
  const [avatar, setAvatar] = useState();

  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      setAvatar(fire.auth().currentUser.photoURL);
    } else {
      setAvatar(
        "https://iicllhawaii.iafor.org/wp-content/uploads/sites/31/2017/02/IAFOR-Blank-Avatar-Image-1.jpg"
      );
    }
  });

  return (
    <div className={styles.navbar__container}>
      <img
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        src="/hamburger.svg"
        alt=""
      />
      <img src="/fomo_logo.svg" alt="" />
      <img className={styles.avatar} src={avatar} alt="" />
    </div>
  );
}
