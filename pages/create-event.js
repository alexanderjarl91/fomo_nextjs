import React, { useContext, useState, useEffect, useRef } from "react";
import { DataContext } from "../context";
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
  const [isPosting, setIsPosting] = useState(false);

  //add data to event state
  const completeEventData = async () => {
    const tempEvent = { ...event };
    tempEvent.categories = categories;
    tempEvent.uid = fire.auth().currentUser.uid;
    tempEvent.eventId = await uuidv4();
    tempEvent.status = "pending";

    tempEvent.location = {
      name: address.split(",")[0], //location name split at first comma
      coordinates: coordinates,
    };
    return tempEvent;
  };

  const postEvent = async () => {
    const tempEvent = await completeEventData();
    setIsPosting(true);

    // post event to firestore events collection after 1 second (to show loading indicator)
    setTimeout(()=> {
      fire
        .firestore()
        .collection("events")
        .doc(tempEvent.title)
        .set(tempEvent)
        .then(() => {
          saveToMyEvents(tempEvent.eventId);
          router.push("/");
        });
    }, 1000)
  };

  //post event to users own event collection
  const saveToMyEvents = async (eventId) => {
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
    tempEvents.push(eventId);
    //post new array to database
    console.log("tempEvents :>> ", tempEvents);
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

  useEffect(() => {
    console.log(categories);
  }, [categories]);

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
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              Select a title for your event
            </p>
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

          {/* <div id="map" className={styles.map} ref={mapRef}></div> */}

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
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              What calendar day is your event taking place?
            </p>

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
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              At what time does your event begin?
            </p>

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
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              How much to enter your event, if it applies? (prices are in ISK)
            </p>

            <input
              type="number"
              name=""
              placeholder="0"
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
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              The action button in your event leads to a page of your choice,
              choose something short and descriptive
            </p>
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
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              Where should your action button lead to?
            </p>

            <input
              type="text"
              placeholder="www.buytickets.com/your-event"
              onChange={(e) => {
                const tempEvent = { ...event };
                tempEvent.url = e.target.value;
                setEvent(tempEvent);
              }}
            />
          </div>

          <div>
            <label htmlFor="">Image</label>
            <p style={{ opacity: 0.5, marginBottom: "5px" }}>
              If your event image is in landscape resolution we suggest
              designing a portrait rendition for best outcome
            </p>
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
            <label htmlFor="">Card preview</label>
            <div
              className={styles.preview}
              style={{
                backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ) ${
                  event.image ? `, url(${event.image})` : ""
                }`,
              }}
            >
              <div className={styles.gradient}></div>
              <h3>{event?.title}</h3>
              <div className={styles.location__container}>
                <img src="/location_pin.svg" alt="" />
                <p>Your selected location</p>
              </div>
              {event?.date && (
                <div className={styles.date__container}>
                  <img src="/date.svg" alt="" />
                  <p>
                    {new Date(event.date)
                      .toDateString()
                      .substr(
                        0,
                        new Date(event.date).toDateString().length - 5
                      )}
                  </p>
                </div>
              )}
            </div>
          </div>
          <p>
            {" "}
            note: events are not published until they have been accepted by an
            admin
          </p>
          {isPosting? <button
            className={styles.post__button}
            onClick={() => {
              postEvent();
            }}
          >
            <img style={{height: "16px"}} src="/posting.gif"/>
          </button> : <button
            className={styles.post__button}
            onClick={() => {
              postEvent();
            }}
          >
            POST EVENT
          </button> }
          
        </div>
      </div>
    </div>
  );
}
