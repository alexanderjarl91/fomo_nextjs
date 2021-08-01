import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "../styles/Menu.module.css";
import fire from "../firebase";
import { useRouter } from "next/router";
import { UsersContext, DataContext } from "../context";
import OutsideClickHandler from "react-outside-click-handler";
import { BsCardChecklist } from "react-icons/bs";
const Menu = () => {
  const { pendingEvents } = useContext(DataContext);
  const { userData, showMenu, setShowMenu } = useContext(UsersContext);
  const router = useRouter();

  // Route to X parameter function
  const routeTo = (route) => {
    router.push(`/${route}`);
    setShowMenu(false);
  };

  return (
    <div className={styles.container}>
      <OutsideClickHandler
        onOutsideClick={() => {
          setShowMenu(false);
        }}
      >
        <div className={styles.menu}>
          {fire.auth().currentUser ? (
            <>
              <div className={styles.menu__profile}>
                <img
                  className={styles.menu__avatar}
                  src={fire.auth().currentUser.photoURL}
                  alt=""
                  onClick={() => {
                    router.push("/profile");
                  }}
                />
                <h1>{fire.auth().currentUser.displayName}</h1>
                {userData?.promoter ? (
                  <p>promoter</p>
                ) : (
                  <p>{fire.auth().currentUser.email}</p>
                )}
              </div>

              <div className={styles.menu__nav}>
                <li
                  onClick={() => {
                    routeTo("");
                  }}
                >
                  <img src="/menu_icons/events.svg" alt="" />
                  <p>Events</p>
                </li>
                <li
                  onClick={() => {
                    routeTo("interested");
                  }}
                >
                  <img src="/menu_icons/interested.svg" alt="" />
                  <p>Interested</p>
                </li>

                {userData && userData.promoter ? (
                  <>
                    <li
                      onClick={() => {
                        routeTo("my-events");
                      }}
                    >
                      <img src="/menu_icons/events.svg" alt="" />
                      <p>My events</p>
                    </li>

                    {fire.auth().currentUser.email ==
                      "alexanderjarl91@gmail.com" && (
                      <li
                        onClick={() => {
                          routeTo("manage-events");
                        }}
                      >
                        <BsCardChecklist />
                        <p>Manage events</p>
                        {pendingEvents && pendingEvents?.length > 0 && (
                          <span className={styles.notification}></span>
                        )}
                      </li>
                    )}

                    <li
                      onClick={() => {
                        routeTo("profile");
                      }}
                    >
                      <img src="/menu_icons/user.svg" alt="" />
                      <p>Profile</p>
                    </li>

                    <button
                      onClick={() => {
                        router.push("/create-event");
                        setShowMenu(false);
                      }}
                    >
                      Create event
                    </button>
                  </>
                ) : null}
              </div>
            </>
          ) : (
            // NOT LOGGED IN
            <div className={styles.loggedOut__container}>
              <img
                onClick={() => {
                  setShowMenu(!showMenu);
                }}
                src="/fomo_logo.svg"
                alt=""
              />
              <p>
                Sign in to see more events and use all of the fomo features or
                promote your own event!
              </p>
              <button
                onClick={() => {
                  routeTo("signup");
                }}
              >
                Sign in
              </button>

              <p> with an existing Google or Facebook account</p>
            </div>
          )}

          {/* FOOTER  */}
          <div className={styles.footer}>
            <div className={styles.footer__line}></div>
            <ul>
              {!userData || (userData && !userData.promoter) ? (
                <li>
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push("/promoter");
                      setShowMenu(false);
                    }}
                  >
                    <strong>Become a promoter</strong>
                  </p>
                </li>
              ) : null}
              <li>
                <a href="">About us</a>
              </li>
              <li>
                <a href="">Contact us</a>
              </li>
            </ul>

            <div className={styles.footer__socialIcons}>
              <a target="_blank"  href="https://www.facebook.com/www.fomo.events">
              <img src="/facebook.svg" alt="www.facebook.com"/>
              </a>

                  <a target="_blank" href="https://www.instagram.com/fomoxevents">
              <img src="/instagram.svg" alt="" />

                  </a>
            </div>
            <p className={styles.copyright}>Pippen ehf © 2021</p>
          </div>
        </div>
      </OutsideClickHandler>
    </div>
  );
};
export default Menu;
// export default onClickOutside(Menu, clickOutsideConfig);
