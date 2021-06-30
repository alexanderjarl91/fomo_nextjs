import React, { useContext, useState, useEffect, useRef } from "react";
import { UsersContext, DataContext } from "../context";
import { useRouter } from "next/router";
import fire from "../firebase";
import styles from "../styles/CreateEvent.module.css";
import { v4 as uuidv4 } from "uuid";

//components
import PlacesInput from "../components/PlacesInput";

export default function maptester() {
  //context data
  const { isMapsLoaded } = useContext(DataContext);
  const router = useRouter();
  const [event, setEvent] = useState({});
  const [categories, setCategories] = useState([]);
  const [address, setAddress] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: null,
    lng: null,
  });

  const postEvent = () => {
    //add userId to event
    const tempEvent = { ...event };
    tempEvent.categories = categories;
    tempEvent.uid = fire.auth().currentUser.uid;
    tempEvent.eventId = uuidv4();
    tempEvent.status = "pending";
    event.location = {};
    event.location.name = address.split(",")[0]; //location name split at first comma
    event.location.coordinates = coordinates;

    setEvent(tempEvent);
    // post event to firestore events collection
    fire
      .firestore()
      .collection("events")
      .doc(event.title)
      .set(event)
      .then(() => {
        router.push("/");
        saveToMyEvents();
      });
  };

  //post event to users own event collection
  const saveToMyEvents = async () => {
    //get authenticated user
    const userRef = await fire
      .firestore()
      .collection("users")
      .doc(fire.auth().currentUser.email);

    //get auth users data
    const doc = await userRef.get();
    let tempEvents = [];
    if (!doc.exists) return;

    //create a copy of users events array
    if (doc.data().events) {
      tempEvents = doc.data().events;
    }

    //push new events ID to copy of array
    tempEvents.push(event.eventId);
    //post new array to database
    userRef.update({ events: tempEvents });
  };

  // SET CATEGORIES
  const addCategory = (category) => {
    const tempCategories = categories.slice(0);
    if (!categories.includes(category)) {
      tempCategories.push(category);
      setCategories(tempCategories);
      return;
    }

    if (categories.includes(category)) {
      const newArray = tempCategories.filter((e) => e !== category);
      setCategories(newArray);
      return;
    }
  };

  //toggle active class to change style & run addCategory function
  const handleSelect = (element, category) => {
    element.classList.toggle(styles.active);
    addCategory(category);
  };

  useEffect(() => {
    console.log("event", event);
  }, [event]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (!isMapsLoaded) return; //return if maps is not loaded
    if (!mapRef) return;
    const mapOptions = {
      disableDefaultUI: true,
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    };
    console.log(`google`, google);
    new google.maps.Map(mapRef.current, mapOptions);
  }, [isMapsLoaded]);

  return (
    <div className={styles.container}>
      <div className={styles.createEvent__container}>
        {/* PAGE CONTENT */}
        <h2>Create Event</h2>
        <div className={styles.headline}>
          <h3>Event details</h3>
          <p>
            Lets build your event card, fill in the details below for a preview
            of your event.
          </p>
        </div>

        <div className={styles.event__form}>
          <div>
            <label htmlFor="">Event title</label>
            <input
              type="text"
              name=""
              placeholder="Whats your event called?"
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="">Promoter</label>
            <input
              type="text"
              name=""
              placeholder="Who's planning this event?"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.promoter = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div id="map" className={styles.map} ref={mapRef}></div>

          {isMapsLoaded && (
            <div>
              <PlacesInput
                address={address}
                setAddress={setAddress}
                coordinates={coordinates}
                setCoordinates={setCoordinates}
                setCurrentInput={setCurrentInput}
                currentInput={currentInput}
              />
            </div>
          )}

          <div>
            <label htmlFor="">Date</label>
            <input
              type="date"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.date = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div>
            <label htmlFor="">Time</label>
            <input
              type="time"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.time = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div>
            <label htmlFor="">Price</label>
            <input
              type="number"
              name=""
              placeholder="How much to enter? (if it applies)"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.price = e.target.value;

                if (tempEvent > 0) {
                  setEvent(tempEvent);
                }
              }}
            />
          </div>

          <div>
            <label htmlFor="">Description</label>
            <textarea
              type="text"
              cols="5"
              placeholder="Describe your event in 300 characters or less"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.description = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div>
            <label htmlFor="">Category (select atleast 1 and 2 at most)</label>
            <div className={styles.what__buttonContainer}>
              <li
                onClick={(e) => {
                  // addCategory("music");
                  handleSelect(e.target, "music");
                }}
              >
                music
              </li>
              <li
                onClick={(e) => {
                  handleSelect(e.target, "nightlife");
                }}
              >
                nightlife
              </li>
              <li
                onClick={(e) => {
                  handleSelect(e.target, "art");
                }}
              >
                art
              </li>
              <li
                onClick={(e) => {
                  handleSelect(e.target, "sports");
                }}
              >
                sports
              </li>
              <li
                onClick={(e) => {
                  handleSelect(e.target, "food");
                }}
              >
                food
              </li>
              <li
                onClick={(e) => {
                  handleSelect(e.target, "other");
                }}
              >
                other
              </li>
            </div>
          </div>
          <div>
            <label htmlFor="">Action button text</label>
            <input
              type="text"
              name=""
              placeholder="What should your action button say?"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.actionButton = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>
          <div>
            <label htmlFor="">Action button URL</label>
            <input
              type="text"
              placeholder="Where should your action button lead to?"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.url = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div>
            <label htmlFor="">Image</label>
            <input
              type="text"
              placeholder="A link to your image.."
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.image = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div>
            <label htmlFor="">Preview</label>
            <div
              className={styles.preview}
              style={{
                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ) ${
                  event.image ? `, url(${event.image})` : ""
                }`,
              }}
            >
              <div className={styles.gradient}></div>
              <h3>Title</h3>
              <div className={styles.location__container}>
                <img src="/location_pin.svg" alt="" />
                <p>HARPA</p>
              </div>
              <div className={styles.date__container}>
                <img src="/date.svg" alt="" />
                <p>29. júni</p>
              </div>
            </div>
          </div>
          <p>
            {" "}
            note: events are not published until they have been accepted by an
            admin
          </p>
          <button
            className={styles.post__button}
            onClick={() => {
              postEvent();
            }}
          >
            POST EVENT
          </button>
        </div>
      </div>
    </div>
  );
}
