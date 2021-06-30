// import React from "react";
// import styles from "../styles/Map.module.css";

// import {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   Marker,
// } from "react-google-maps";

// export default function EventMap({ coordinates }) {
//   // MAP
//   const MyMapComponent = withScriptjs(
//     withGoogleMap((props) => (
//       <GoogleMap
//         defaultZoom={14}
//         defaultCenter={coordinates}
//         options={mapOptions}
//       >
//         {props.isMarkerShown && <Marker position={coordinates} />}
//       </GoogleMap>
//     ))
//   );

//   const mapOptions = {
//     disableDefaultUI: true,
//   };
//   return (
//     <div className={styles.map__container}>
//       <MyMapComponent
//         isMarkerShown
//         googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyA2WN37oJn1RxGfx5ltyGDGZZ7gzGaGFM8&v=3.exp&libraries=geometry,drawing,places"
//         loadingElement={<div style={{ height: `50%` }} />}
//         containerElement={<div style={{ height: `100px` }} />}
//         mapElement={<div style={{ height: `100%`, borderRadius: "20px" }} />}
//       />
//     </div>
//   );
// }
