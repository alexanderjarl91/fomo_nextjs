import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/Navbar.module.css";
import { UsersContext } from "../context";

//components
import Menu from "./Menu";

export default function Navbar() {
  const router = useRouter();
  const [avatar, setAvatar] = useState();

  const { signInWithGoogle, signOut, showMenu, setShowMenu } =
    useContext(UsersContext);

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
    <>
      {showMenu ? <Menu /> : null}
      <div className={styles.navbar__container}>
        <img
          onClick={() => {
            setShowMenu(!showMenu);
          }}
          src="/hamburger.svg"
          alt=""
        />
        <img src="/fomo_logo.svg" alt="" />
        <img
          onClick={() => {
            router.push("/profile");
          }}
          className={styles.avatar}
          src={avatar}
          alt=""
          style={{ cursor: "pointer" }}
        />
      </div>
    </>
  );
}
