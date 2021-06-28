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
import { te } from "date-fns/locale";
import _, { map } from "underscore";

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
      .catch((error) => {
        console.log(`error`, error);
      });
  };

  //   AUTH STATE OBSERVER
  // fire.auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     console.log("logged in as:", user.displayName);
  //   } else {
  //     console.log("user not logged in");
  //   }
  // });

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

  // get index of active card
  useEffect(() => {
    setActiveCardIndex(filteredEvents?.length - 1);
  }, [filteredEvents]);

  // fetch event data, shuffle them and set to state
  const getCards = async () => {
    const cardsRef = fire.firestore().collection("events");
    const snapshot = await cardsRef.get();
    let tempCards = [];
    await snapshot.forEach((doc) => {
      tempCards = [...tempCards, doc.data()];
    });

    // set cards
    setCards(tempCards);
    //filter only events where event.date > current date

    setFutureEvents(
      tempCards?.filter(
        (item) => !isBefore(new Date(item.date), endOfYesterday())
      )
    );
  };

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
        console.log("both filters applied");
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
        console.log("category filters applied");
        let tempCategories = [];
        if (key == 1) {
          console.log(val["categories"]);
          activeCategories.map((flag, i) => {
            val["categories"].map((item) => {
              console.log(item);
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
        console.log("dates filters applied");
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
        console.log("no filters applied");
        tempEvents = futureEvents;
      }
    });

    const onlyUnique = (value, index, self) => {
      return self.indexOf(value) === index;
    };

    const unique = tempEvents?.filter(onlyUnique);

    setFilteredEvents(unique);
  }, [futureEvents, activeCategories, dateFilter]);

  //get distance to each event
  useEffect(() => {
    if (userLocation?.code) return; //return if userLocation has error code

    if (userLocation) {
      futureEvents?.map((event, i) => {
        const eventLocation = event.location.coordinates;

        // origin is the users current location
        let origin = new google.maps.LatLng(
          userLocation?.latitude,
          userLocation?.longitude
        );
        //convert event location to a google object
        let destination = new google.maps.LatLng(
          eventLocation.lat,
          eventLocation.lng
        );

        var service = new google.maps.DistanceMatrixService();

        //get distance from origin to destination with driving as travel mode
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: "DRIVING",
          },

          callback
        );
        function callback(response, status) {
          const eventDistance =
            response?.rows[0].elements[0].distance?.value / 1000;
          // console.log(event.title, eventDistance, "km away");
        }
      });
    }
  }, [userLocation, filteredEvents]);

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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
