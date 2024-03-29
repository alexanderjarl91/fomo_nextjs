import React, { useState, useEffect, useContext } from "react";
import { Router, useRouter } from "next/router";
import haversine from "haversine-distance";
import { sendMessage } from "./utils/slack";

import {
  isToday,
  isBefore,
  isThisWeek,
  isThisMonth,
  isTomorrow,
  endOfYesterday,
  set,
} from "date-fns";
import fire, {
  google_provider,
  getAuth,
  signInWithPopup,
  fb_provider,
} from "./firebase";
import _, { map } from "underscore";
import { resolveHref } from "next/dist/next-server/lib/router/router";

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

    if (!user || !fire.auth().currentUser) return;
    if (!fire.auth().currentUser.email) return;

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

  fire
    .auth()
    .getRedirectResult()
    .then(async (result) => {
      if (result.credential) {
        /** @type {firebase.auth.OAuthCredential} */

        const data2 = { text: `${fire.auth().currentUser.email} logged in.` };
        await sendMessage(data2);

        const data = {
          name: fire.auth().currentUser.displayName,
          email: fire.auth().currentUser.email,
          avatar: fire.auth().currentUser.photoURL,
          uid: fire.auth().currentUser.uid,
          seen: [],
        };
        await fire
          .firestore()
          .collection("users")
          .doc(fire.auth().currentUser.email)
          .set(data, { merge: true });
      }
      // The signed-in user info.
      var user = result.user;
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

  // SIGN IN WITH GOOGLE
  const signInWithGoogle = async () => {
    await fire.auth().signInWithRedirect(google_provider);

    // .then((result) => {
    //   /** @type {firebase.auth.OAuthCredential} */
    // })
    // .catch((error) => {
    //   // Handle Errors here.
    //   var errorCode = error.code;
    //   var errorMessage = error.message;
    //   // The email of the user's account used.
    //   var email = error.email;
    //   // The firebase.auth.AuthCredential type that was used.
    //   var credential = error.credential;
    //   console.log("ERROR", error);
    // })

    // // CREATE USER DATA IN FIRESTORE
    // .then(async () => {
    //   const data2 = { text: `${fire.auth().currentUser.email} logged in.` };
    //   await sendMessage(data2);

    //   const data = {
    //     name: fire.auth().currentUser.displayName,
    //     email: fire.auth().currentUser.email,
    //     avatar: fire.auth().currentUser.photoURL,
    //     uid: fire.auth().currentUser.uid,
    //     seen: [],
    //   };
    //   await fire
    //     .firestore()
    //     .collection("users")
    //     .doc(fire.auth().currentUser.email)
    //     .set(data, { merge: true });
    // });
  };

  // fire.auth().onAuthStateChanged((user) => {
  //   if (fire.auth().currentUser?.email === "alexanderjarl91@gmail.com") return;
  //   if (user) {
  //     const data2 = { text: `${fire.auth().currentUser.email} logged in.` };
  //     sendMessage(data2);
  //   }
  // });

  const signInWithFacebook = () => {
    fire
      .auth()
      .signInWithPopup(fb_provider)
      .then((result) => {
        console.log("result:", result);

        var credential = result.credential;
        var user = result.user;
        var accessToken = credential.accessToken;
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(error);
      }); // CREATE USER DATA IN FIRESTORE
    // .then(async () => {
    //   const data = {
    //     name: fire.auth().currentUser.displayName,
    //     email: fire.auth().currentUser.email,
    //     // promoter: false,
    //     avatar: fire.auth().currentUser.photoURL,
    //     uid: fire.auth().currentUser.uid,
    //     seen: [],
    //   };
    //   await fire
    //     .firestore()
    //     .collection("users")
    //     .doc(fire.auth().currentUser.email)
    //     .set(data, { merge: true });
    // });
  };

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
        signInWithFacebook,
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
  const [allEvents, setAllEvents] = useState();
  const [userData, setUserData] = useState();
  // const [refreshData, setRefreshData] = useState(false);
  const [pendingEvents, setPendingEvents] = useState();
  const [filteredEvents, setFilteredEvents] = useState(); //events after filtering (rendered)
  const [userLocation, setUserLocation] = useState(); //users current location
  const [maxDistance, setMaxDistance] = useState(500); //max distance set in filter
  const [maxRange, setMaxRange] = useState(500); //max distance set in filter
  const [activeCategories, setActiveCategories] = useState([]); //array of categories active
  const [dateFilter, setDateFilter] = useState([]); // array of date selections active
  const [eventDistanceArr, setEventDistanceArr] = useState();
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

  //get user data when user logs in
  useEffect(() => {
    getUserData();
  }, [fire.auth().currentUser]);

  const clearSeen = async () => {
    console.log("hello");
    await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email)
      .update({ seen: [] });
    getEvents();
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

  ////GET EVENTS AND FILTER ONLY ACTIVE, FUTURE & UNSEEN EVENTS (if user is logged in)
  const getEvents = async () => {
    console.log("getting events");
    const cardsRef = fire.firestore().collection("events");
    const snapshot = await cardsRef.get();
    let tempEvents = [];
    await snapshot.forEach((doc) => {
      tempEvents = [...tempEvents, doc.data()];
    });

    const allFutureEvents = tempEvents?.filter(
      (item) => !isBefore(new Date(item.date), endOfYesterday())
    );

    let pending = allFutureEvents?.filter(
      (event) => event.status === "pending"
    );
    setPendingEvents(pending);

    let approvedFutureEvents = allFutureEvents?.filter(
      (event) => event.status === "approved"
    );
    setAllEvents(approvedFutureEvents);
  };

  const [futureEventsWithDistance, setFutureEventsWithDistance] = useState();
  //APPEND DISTANCE TO ALL EVENTS
  const appendDistance = (eventsArr) => {
    if (!isMapsLoaded) return; //return if google maps isnt loaded
    if (userLocation?.code) return; //return if userLocation has error code
    if (userLocation) {
      let tempDistanceArr = [];
      if (eventsArr?.length > 0) {
        eventsArr.map((event, i) => {
          const eventLocation = event.location.coordinates;
          // origin is the users current location
          let origin = {
            latitude: userLocation?.latitude,
            longitude: userLocation?.longitude,
          };
          let destination = {
            latitude: eventLocation.lat,
            longitude: eventLocation.lng,
          };
          const eventDistance = haversine(origin, destination) / 1000;
          event.distance = eventDistance;
          tempDistanceArr = [...tempDistanceArr, event];
        });
        setFutureEventsWithDistance(
          tempDistanceArr
            .filter((event) => event.distance < maxDistance)
            .sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            })
        );
      } else {
        setFutureEventsWithDistance([]);
      }
    }
  };
  //append distance to events
  useEffect(() => {
    appendDistance(filteredEvents);
  }, [filteredEvents, userLocation]);

  //USER FILTER EVENT
  useEffect(() => {
    let tempEvents = [];
    const filter = [
      {
        dates: [
          ["today", allEvents?.filter((item) => isToday(new Date(item.date)))],
          [
            "tomorrow",
            allEvents?.filter((item) => isTomorrow(new Date(item.date))),
          ],
          [
            "this week",
            allEvents?.filter((item) => isThisWeek(new Date(item.date))),
          ],
          [
            "this month",
            allEvents?.filter((item) => isThisMonth(new Date(item.date))),
          ],
        ],
      },
      {
        categories: [
          [
            "music",
            allEvents?.filter((item) => item.categories.includes("music")),
          ],
          [
            "sports",
            allEvents?.filter((item) => item.categories.includes("sports")),
          ],
          [
            "nightlife",
            allEvents?.filter((item) => item.categories.includes("nightlife")),
          ],
          [
            "food",
            allEvents?.filter((item) => item.categories.includes("food")),
          ],
          ["art", allEvents?.filter((item) => item.categories.includes("art"))],
          [
            "other",
            allEvents?.filter((item) => item.categories.includes("other")),
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
        tempEvents = allEvents;
      }
    });

    //remove duplicates
    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    const unique = tempEvents?.filter(onlyUnique);

    setFilteredEvents(unique);
  }, [allEvents, activeCategories, dateFilter, maxDistance]);

  return (
    <DataContext.Provider
      value={{
        getEvents,
        userLocation,
        setUserLocation,
        categoryItems,
        activeCategories,
        setActiveCategories,
        filteredEvents,
        setFilteredEvents,
        futureEventsWithDistance,
        dateFilters,
        dateFilter,
        setDateFilter,
        maxDistance,
        setMaxDistance,
        isMapsLoaded,
        clearSeen,
        userData,
        maxRange,
        pendingEvents,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
