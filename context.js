import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import fire, { google_provider } from "./firebase";

export const UsersContext = React.createContext();

export const UsersProvider = ({ children }) => {
  // SIGN IN WITH GOOGLE
  const signInWithGoogle = () => {
    fire
      .auth()
      .signInWithPopup(google_provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  };

  //   SIGN OUT
  const signOut = () => {
    fire
      .auth()
      .signOut()
      .then(() => {
        console.log("sign out successful");
      })
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  //   AUTH STATE OBSERVER
  fire.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("logged in as:", user.displayName);
    } else {
      console.log("user not logged in");
    }
  });

  return (
    <UsersContext.Provider value={{ signInWithGoogle, signOut }}>
      {children}
    </UsersContext.Provider>
  );
};
