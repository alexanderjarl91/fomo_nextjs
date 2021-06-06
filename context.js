import React, { useState, useEffect, useContext } from "react";
import { Router, useRouter } from "next/router";
import {
  isFuture,
  format,
  isPast,
  isToday,
  isBefore,
  isThisWeek,
  isThisMonth,
  isTomorrow,
  endOfYesterday,
} from "date-fns";
import fire, {
  google_provider,
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
} from "./firebase";

export const UsersContext = React.createContext();
export const UsersProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(() => {
    // If a user is already logged in, use the current User object, or `undefined` otherwise.
    return fire.auth().currentUser || undefined;
  });
  const [userData, setUserData] = useState();

  // keeps `user` up to date
  useEffect(() => fire.auth().onAuthStateChanged(setUser), []);

  // keeps `userData` up to date
  useEffect(() => {
    if (user === null) {
      setUserData(null); // <-- clear data when not logged in
      return;
    }

    if (!user) return;

    return fire // <-- return the unsubscribe function from onSnapshot
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email)
      .onSnapshot({
        next(snapshot) {
          setUserData(snapshot.data());
        },
        error(err) {
          console.log(err);
        },
      });
  }, [user]); // <-- rerun when user changes

  // SIGN IN WITH GOOGLE
  const signInWithGoogle = () => {
    fire
      .auth()
      .signInWithPopup(google_provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
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
      })
      // CREATE USER DATA IN FIRESTORE
      .then(async () => {
        const data = {
          name: fire.auth().currentUser.displayName,
          email: fire.auth().currentUser.email,
          // promoter: false,
          avatar: fire.auth().currentUser.photoURL,
          uid: fire.auth().currentUser.uid,
        };
        await fire
          .firestore()
          .collection("users")
          .doc(fire.auth().currentUser.email)
          .set(data, { merge: true });
      });
  };

  // const provider = new FacebookAuthProvider();
  // provider.addScope("user_birthday");
  // provider.setCustomParameters({
  //   display: "popup",
  // });

  // const signInWithFacebook = () => {
  //   const provider = new FacebookAuthProvider();
  //   provider.addScope("user_birthday");
  //   provider.setCustomParameters({
  //     display: "popup",
  //   });

  //   const auth = getAuth();

  //   fire
  //     .auth()
  //     .signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // The signed-in user info.
  //       const user = result.user;

  //       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //       const credential = FacebookAuthProvider.credentialFromResult(result);
  //       const accessToken = credential.accessToken;

  //       // ...
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  //SIGN OUT
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

  const [showMenu, setShowMenu] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <UsersContext.Provider
      value={{
        user,
        userData,
        signInWithGoogle,
        signOut,
        showMenu,
        setShowMenu,
        showFilter,
        setShowFilter,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export const DataContext = React.createContext();
export const DataProvider = ({ children }) => {
  const [cardsDisplayed, setCardsDisplayed] = useState([]);
  const [cards, setCards] = useState([]);
  const [activeCardIndex, setActiveCardIndex] = useState();
  const [userLocation, setUserLocation] = useState();

  // callback to log the active cards index
  useEffect(() => {
    console.log("current active card index:", activeCardIndex);
  }, [activeCardIndex]);

  useEffect(() => {
    // fetch event data, shuffle them and set to state
    const getCards = async () => {
      const cardsRef = fire.firestore().collection("events");
      const snapshot = await cardsRef.get();
      let tempCards = [];
      await snapshot.forEach((doc) => {
        tempCards = [...tempCards, doc.data()];
        // console.log("🚀 ~ file: context.js ~ line 176 ~ awaitsnapshot.forEach ~ doc.data()", doc.data().categories)
      });
      // set cards
      shuffleArray(tempCards);
      setCards(tempCards);
      setActiveCardIndex(tempCards.length - 1);
    };
    getCards();
  }, []);

  // randomize order of array
  const shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };
  //state for final filtered array to be rendered
  const [filteredEvents, setFilteredEvents] = useState();

  // FILTER
  const [categoryItems, setCategoryItems] = useState([
    "music",
    "nightlife",
    "art",
    "sports",
    "food",
    "other",
  ]);
  const [todayDate, setTodayDate] = useState(new Date());
  const [activeDates, setActiveDates] = useState("");
  const [dateFilter, setDateFilter] = useState([]);

  const [dateFilters, setDateFilters] = useState([
    "Today",
    "Tomorrow",
    "This Week",
    "This Month",
  ]);

  //STEP 1. query database for all events where event.date > current date
  const [futureEvents, setFutureEvents] = useState();

  useEffect(() => {
    // show only events that are not before the end of yesterday
    setFutureEvents(
      cards?.filter((item) => !isBefore(new Date(item.date), endOfYesterday))
    );
  }, [cards]);

  //STEP 2. filter only active categories
  const [activeCategories, setActiveCategories] = useState(""); //array of categories active

  useEffect(() => {
    let tempdates = [];
    //object with events filtered by time
    const datefilterobj = {
      Today: futureEvents?.filter((item) => isToday(new Date(item.date))),
      Tomorrow: futureEvents?.filter((item) => isTomorrow(new Date(item.date))),
      "This Week": futureEvents?.filter((item) =>
        isThisWeek(new Date(item.date))
      ),
      "This Month": futureEvents?.filter((item) =>
        isThisMonth(new Date(item.date))
      ),
    };

    //compare current dateFilter values to datefilterobj
    dateFilter.map((filter, i) => {
      //getting object entries as an array and then mapping
      Object.entries(datefilterobj).map((key, i) => {
        //each key returns an array = ["key", [value]]
        if (key[0] == filter) {
          tempdates = [...tempdates, ...key[1]];
        }
      });
    });
    //temp rendered events
    let eventsFiltered = futureEvents;

    //if there is an active category filter, set filteredEvents to activeCategories
    if (activeCategories != "") {
      eventsFiltered = futureEvents.filter((event) =>
        event.categories?.includes(activeCategories)
      );
      //if user has filtered with date, set eventsFiltered
    } else if (tempdates.length > 0) {
      eventsFiltered = tempdates;
    }
    setFilteredEvents(eventsFiltered);
  }, [futureEvents, activeCategories, dateFilter]);

  useEffect(() => {
    console.log("currently rendering:", filteredEvents);
  }, [filteredEvents]);

  return (
    <DataContext.Provider
      value={{
        cards,
        setCards,
        activeCardIndex,
        setActiveCardIndex,
        userLocation,
        setUserLocation,
        categoryItems,
        activeCategories,
        setActiveCategories,
        filteredEvents,
        dateFilters,
        dateFilter,
        setDateFilter,
        futureEvents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
