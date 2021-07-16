import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB-8VmGyJDG2WAq2Ig1IJIqi3BZclj2HrA",
  authDomain: "fomo-e859a.firebaseapp.com",
  projectId: "fomo-e859a",
  storageBucket: "fomo-e859a.appspot.com",
  messagingSenderId: "655772511439",
  appId: "1:655772511439:web:597dde10244e315b5fdbba",
  measurementId: "G-Y8076LN7VW",
};

const fire = firebase.apps.length
  ? firebase.app()
  : firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const analytics = firebase.analytics;

export const google_provider = new firebase.auth.GoogleAuthProvider();
export const fb_provider = new firebase.auth.FacebookAuthProvider();
fb_provider.addScope("email");

export default fire;
