import React, { useState, useContext, useEffect } from "react";
import { DataContext, UsersContext } from "../context";
import styles from "../styles/Filter.module.css";
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';


export default function Filter() {
const { setShowFilter, showFilter } = useContext(UsersContext);
const {categoryFlags, setCategoryFlag, categoryFlag} = useContext(DataContext);
const [maxKm, setMaxKm] = useState(50)

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  // DISTANCE STUFF

  // function distance(lat1, lon1, lat2, lon2, unit) {
  //   if (lat1 == lat2 && lon1 == lon2) {
  //     return 0;
  //   } else {
  //     var radlat1 = (Math.PI * lat1) / 180;
  //     var radlat2 = (Math.PI * lat2) / 180;
  //     var theta = lon1 - lon2;
  //     var radtheta = (Math.PI * theta) / 180;
  //     var dist =
  //       Math.sin(radlat1) * Math.sin(radlat2) +
  //       Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //     if (dist > 1) {
  //       dist = 1;
  //     }
  //     dist = Math.acos(dist);
  //     dist = (dist * 180) / Math.PI;
  //     dist = dist * 60 * 1.1515;
  //     if (unit == "K") {
  //       dist = dist * 1.609344;
  //     }
  //     if (unit == "N") {
  //       dist = dist * 0.8684;
  //     }

  //     console.log("distance is:", dist);
  //     return dist;
  //   }
  // }

  // const { userLocation, setUserLocation } = useContext(DataContext);

  // useEffect(() => {
  //   distance(userLocation.latitude, userLocation.longitude, 64.1427936, -21.9125927, "K");
  // }, [userLocation])

  const handleCategoryFlag = (flag) => {
    setCategoryFlag(flag)
  };

    //toggle active class to change style & run addCategory function
    const handleSelect = (element, category) => {
      element.classList.toggle(styles.active);
    };

const log = (value) => {
  setMaxKm(value)
}


  return (
    <div className={styles.container}>
      <div className={styles.filter}>
        <div className={styles.header}>
          <h1>FILTER</h1>
          <img onClick={handleFilter} src={"/close_filter.svg"} alt="" />
        </div>
        <div className={styles.filter__content}>
          {/* WHAT? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>what?</h3>
              <p>deselecting all will show all categories</p>
            </div>

            <div className={styles.what__buttonContainer}>
              {categoryFlags?.map((flag, i) => (
                <li key={i} onClick={(e) => {
                  handleCategoryFlag(flag) 
                  handleSelect(e.target)
                    }
                  }>
                  {flag}
                </li>
              ))}
            </div>
          </div>
          <span className={styles.line}></span>

          {/* WHEN? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>when?</h3>
              <p>deselect all to show all</p>
            </div>

            <div className={styles.what__buttonContainer}>
              <li>today</li>
              <li>tomorrow</li>
              <li>this week</li>
              <li>this month</li>
            </div>
          </div>
          <span className={styles.line}></span>

          {/* WHERE? */}
          <div className={styles.what__container}>
            <div className={styles.what__headline}>
              <h3>when?</h3>
              <p>deselect all to show all</p>
            <h2>within {maxKm}km</h2>
            </div>
            <Slider className={styles.slider} defaultValue={50} min={5} max={100} step={5} onChange={log} />
            </div>
            
          <p className={styles.tinyText}>showing x events happening today within 10km</p>
        </div>
      </div>
    </div>
  );
}
