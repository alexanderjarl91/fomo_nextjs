import React, { useState, useEffect, useContext } from "react";
import { Router, useRouter } from "next/router";
import axios from "axios";

import {
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
import _, { includes, map } from "underscore";

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
          seen: [],
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
      .catch((error) => {
        console.log(`error`, error);
      });
  };

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
  const [cards, setCards] = useState([]); // all cards
  const [userData, setUserData] = useState();
  const [refreshData, setRefreshData] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(); //index of event thats shown
  const [futureEvents, setFutureEvents] = useState(); // events that are today or later
  const [filteredEvents, setFilteredEvents] = useState(); //events after filtering (rendered)
  const [userLocation, setUserLocation] = useState(); //users current location
  const [maxDistance, setMaxDistance] = useState(50); //max distance set in filter
  const [activeCategories, setActiveCategories] = useState([]); //array of categories active
  const [dateFilter, setDateFilter] = useState([]); // array of date selections active
  const [categoryItems, setCategoryItems] = useState([
    //all category selections
    "music",
    "nightlife",
    "art",
    "sports",
    "food",
    "other",
  ]);
  const [dateFilters, setDateFilters] = useState([
    // all date selections
    "today",
    "tomorrow",
    "this week",
    "this month",
  ]);

  //get auth users data from firestore
  const getUserData = async () => {
    if (!fire.auth().currentUser) return;
    await fire
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
  };

  useEffect(() => {
    getUserData();
  }, [fire.auth().currentUser]);

  // get index of active card
  useEffect(() => {
    setActiveCardIndex(filteredEvents?.length - 1);
  }, [filteredEvents]);

  // fetch event data, shuffle them and set to state
  const getCards = async () => {
    console.clear();
    console.log("getting cards ....");
    const cardsRef = fire.firestore().collection("events");
    const snapshot = await cardsRef.get();
    let tempCards = [];
    await snapshot.forEach((doc) => {
      tempCards = [...tempCards, doc.data()];
    });

    // set cards
    setCards(tempCards);
    //filter only events where event.date > current date

    const allFutureEvents = tempCards?.filter(
      (item) => !isBefore(new Date(item.date), endOfYesterday())
    );

    //remove seen events
    const removeSeen = (array) => {
      if (!userData) return;
      let unseenEvents = [];
      const seenEvents = userData.seen;

      if (fire.auth().currentUser && userData) {
        unseenEvents = array.filter(
          (item) => !seenEvents.includes(item.eventId)
        );
      }
      return unseenEvents;
    };

    let unseenFutureEvents = [];
    if (userData) {
      console.log("removing seen...");
      unseenFutureEvents = allFutureEvents && removeSeen(allFutureEvents);
    }

    //if user is logged in, set unseen, else set all future
    if (fire.auth().currentUser) {
      setFutureEvents(unseenFutureEvents);
    } else {
      setFutureEvents(allFutureEvents);
    }
  };

  useEffect(() => {
    if (!filteredEvents) return;
    console.log("filteredEvents", filteredEvents);
    console.log(`filteredEvents.length`, filteredEvents.length);
  }, [filteredEvents]);

  //filter whenever
  useEffect(() => {
    let tempEvents = [];
    const filter = [
      {
        dates: [
          [
            "today",
            futureEvents?.filter((item) => isToday(new Date(item.date))),
          ],
          [
            "tomorrow",
            futureEvents?.filter((item) => isTomorrow(new Date(item.date))),
          ],
          [
            "this week",
            futureEvents?.filter((item) => isThisWeek(new Date(item.date))),
          ],
          [
            "this month",
            futureEvents?.filter((item) => isThisMonth(new Date(item.date))),
          ],
        ],
      },
      {
        categories: [
          [
            "music",
            futureEvents?.filter((item) => item.categories.includes("music")),
          ],
          [
            "sports",
            futureEvents?.filter((item) => item.categories.includes("sports")),
          ],
          [
            "nightlife",
            futureEvents?.filter((item) =>
              item.categories.includes("nightlife")
            ),
          ],
          [
            "food",
            futureEvents?.filter((item) => item.categories.includes("food")),
          ],
          [
            "art",
            futureEvents?.filter((item) => item.categories.includes("art")),
          ],
          [
            "other",
            futureEvents?.filter((item) => item.categories.includes("other")),
          ],
        ],
      },
    ];

    // mapping through filter array with all filter conditions
    _.map(filter, (val, key) => {
      //if user has both date & categories filters applied
      if (activeCategories.length > 0 && dateFilter.length > 0) {
        let tempdates = [];
        let eventsMerged = [];
        if (key == 0) {
          dateFilter.map((flag, i) => {
            val["dates"].map((item) => {
              if (item[0] == flag) {
                tempdates = [...tempdates, ...item[1]];
              }
            });
          });
          activeCategories.map((categoryfilter) => {
            eventsMerged = [
              ...eventsMerged,
              ...tempdates.filter((dateEvent) =>
                dateEvent.categories.includes(categoryfilter)
              ),
            ];
          });
          tempEvents = eventsMerged;
        }
        //if user only has a category filters applied
      } else if (activeCategories.length > 0) {
        let tempCategories = [];
        if (key == 1) {
          activeCategories.map((flag, i) => {
            val["categories"].map((item) => {
              if (item[0] == flag) {
                tempCategories = [...tempCategories, ...item[1]];
              }
            });
          });
          tempEvents = tempCategories;
        }
      }

      //if user only has a date filter applied
      else if (dateFilter.length > 0) {
        let tempdates = [];
        if (key == 0) {
          dateFilter.map((flag, i) => {
            val["dates"].map((item) => {
              if (item[0] == flag) {
                tempdates = [...tempdates, ...item[1]];
              }
            });
          });
          tempEvents = tempdates;
        }
        //if user has no filter applied
      } else {
        tempEvents = futureEvents;
      }
    });

    //remove duplicates
    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    const unique = tempEvents?.filter(onlyUnique);

    //set final rendered events state
    setFilteredEvents(unique);
  }, [futureEvents, activeCategories, dateFilter]);

  //SEEN EVENTS FUNCTIONALITY
  const removeSeen = (array) => {
    let unseenEvents = [];
    const seenEvents = userData.seen;

    if (fire.auth().currentUser && userData) {
      unseenEvents = array.filter((item) => !seenEvents.includes(item.eventId));
    }
    return unseenEvents;
  };

  const clearSeen = async () => {
    await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email)
      .update({ seen: [] });

    setRefreshData(!refreshData);
    setActiveCardIndex(filteredEvents.length - 1);
    console.log("seen has been cleared");
  };

  // load google maps script
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);
  useEffect(() => {
    const handleMapsLoad = () => {
      setIsMapsLoaded(true);
    };
    //if google isnt loaded, load it
    if (typeof google === "undefined") {
      const script = document.createElement("script");
      document.body.appendChild(script);

      script.onload = handleMapsLoad;
      script.type = "text/javascript";
      script.async = "true";
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyA2WN37oJn1RxGfx5ltyGDGZZ7gzGaGFM8&libraries=places&v=weekly";
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        cards,
        setCards,
        getCards,
        activeCardIndex,
        setActiveCardIndex,
        userLocation,
        setUserLocation,
        categoryItems,
        activeCategories,
        setActiveCategories,
        filteredEvents,
        setFilteredEvents,
        dateFilters,
        dateFilter,
        setDateFilter,
        futureEvents,
        maxDistance,
        setMaxDistance,
        isMapsLoaded,
        clearSeen,
        userData,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
