import React, { useState, useEffect } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
// } from "react-google-maps";
import styles from "../styles/CreateEvent.module.css";

// const MyMapComponent = withScriptjs(
//   withGoogleMap((props) => (
//     <GoogleMap
//       defaultZoom={12}
//       defaultCenter={{ lat: 64.1425421, lng: -21.9172846 }}
//       options={mapOptions}
//     >
//       {props.isMarkerShown && <Marker position={props.coordinates} />}
//     </GoogleMap>
//   ))
// );

const mapOptions = {
  disableDefaultUI: true,
};

export default function places({
  address,
  setAddress,
  coordinates,
  setCoordinates,
}) {
  // get address & coordinates and set to state once place has been selected
  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    const latlng = await getLatLng(result[0]);
    setAddress(value);
    setCoordinates(latlng);
  };

  // define results for input search
  const searchOptions = {
    types: ["establishment"],
    componentRestrictions: { country: "is" },
  };

  return (
    <>
      <label htmlFor="">Location</label>

      {/* <div className={styles.map__container}>
        <MyMapComponent
          isMarkerShown
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2WN37oJn1RxGfx5ltyGDGZZ7gzGaGFM8&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `50%` }} />}
          containerElement={<div style={{ height: `200px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          coordinates={coordinates}
        />
      </div> */}

      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div key={suggestions.description}>
            <input
              {...getInputProps({
                placeholder: "Search venues ...",
                className: `${styles.location_search_input}`,
              })}
            />
            <div className={styles.autocomplete_dropdown}>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const className = suggestion.active
                  ? `${styles.suggestion_item_active}`
                  : `${styles.suggestion_item}`;
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : {
                      backgroundColor: "white",
                      cursor: "pointer",
                      color: "black",
                      fontSize: "18px",
                    };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </>
  );
}
