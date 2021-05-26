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

  useEffect(() => {
    if (router.query.event)
      console.log("event query from nav", router.query.event);
  }, []);

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
      {/* {showMenu ? <Menu /> : null} */}
      <div className={styles.navbar__container}>
        {router.query.event? 
          <p>back</p>
          : 
          <img
            onClick={() => {
              setShowMenu(!showMenu);
            }}
            src="/hamburger.svg"
            alt=""
          />
          
        }
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
