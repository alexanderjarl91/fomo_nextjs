import React, {useState, useEffect} from "react";
import styles from "../styles/Menu.module.css";
import fire from "../firebase";
import { useRouter } from "next/router";

export default function Menu({ setShowMenu, showMenu }) {

  const router = useRouter();



  return (
    <div className={styles.menu}>

      {fire.auth().currentUser? <>

      <div className={styles.menu__profile}>
        <img onClick={() => {
          setShowMenu(!showMenu);
        }} className={styles.menu__avatar} src={fire.auth().currentUser.photoURL} alt="" />
        <h1>{fire.auth().currentUser.displayName}</h1>
        <p>festival lover</p>
      </div>


      <div className={styles.menu__nav}>


        <li><img src="/menu_icons/events.svg" alt="" /><p>Events</p></li>
        <li><img src="/menu_icons/interested.svg" alt="" /><p>Interested</p></li>
        <li><img src="/menu_icons/user.svg" alt="" /><p>My profile</p></li>
 
        <li><img src="/menu_icons/events.svg" alt="" /><p>My events</p></li>
        
        <button>Create event</button>
  


      </div>
      </> :
      // NOT LOGGED IN
      <div className={styles.loggedOut__container}>
        <img onClick={() => {
            setShowMenu(!showMenu);
          }} src="/fomo_logo.svg" alt="" />
        <p>Sign up to see more events and use all of the fomo features or promote your own event!</p>
        <button onClick={()=> {
          router.push("/signup")
        }}>Sign up</button>
        <p> or <strong><button>sign in</button></strong> with an existing Google account</p>
      </div>
      }

      {/* FOOTER  */}
      <div className={styles.footer}>
        <div className={styles.footer__line}></div>
        <ul>
          <li><a href=""><strong>Become a promoter</strong></a></li>
          <li><a href="">About us</a></li>
          <li><a href="">Contact us</a></li>
        </ul>

        <div className={styles.footer__socialIcons}>
        <img src="/facebook.svg" alt="" />
        <img src="/instagram.svg" alt="" />
        </div>
        <p className={styles.copyright}>Pippen ehf © 2021</p>
      </div>
    </div>
  );
}
