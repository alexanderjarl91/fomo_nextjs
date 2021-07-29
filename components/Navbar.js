import React, { useState, useEffect, useContext, useRef } from "react";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/Navbar.module.css";
import { UsersContext } from "../context";
import cx from "../utils/cx";
//components
import Menu from "./Menu";

export default function Navbar({ showNavBackground }) {
  const router = useRouter();
  const [avatar, setAvatar] = useState();

  const { signInWithGoogle, signOut, showMenu, setShowMenu } =
    useContext(UsersContext);

  //on mount, if user is logged in, set avatar to his avatar - else set to placeholder
  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setAvatar(fire.auth().currentUser.photoURL);
      } else {
        setAvatar(
          "https://iicllhawaii.iafor.org/wp-content/uploads/sites/31/2017/02/IAFOR-Blank-Avatar-Image-1.jpg"
        );
      }
    });
  });

  return (
    <>
      <div
        className={cx(styles.navbar__container, {
          [styles.navbar__containerBackground]: showNavBackground,
        })}
      >
        {router.query.event ? (
          <img
            className={styles.backArrow}
            src="/back_arrow.svg"
            alt=""
            onClick={() => {
              router.back();
            }}
          />
        ) : (
          <img
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            src="/hamburger.svg"
            alt=""
            className={styles.hamburger}
          />
        )}
        <img
          onClick={() => {
            router.push("/");
          }}
          src="/fomo_logo.svg"
          alt=""
        />
        <img
          onClick={() => {
            if (fire.auth().currentUser) {
              router.push("/profile");
            } else {
              router.push("/signup");
            }
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
