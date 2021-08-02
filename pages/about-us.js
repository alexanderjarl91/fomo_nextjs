import React from "react";
import styles from "../styles/About.module.css";
import {useRouter} from "next/router"
import axios from 'axios'

import { sendMessage } from "../utils/slack";

export default function aboutus() {
 

  return <div className={styles.container}>

      <h1>About us</h1>
      <div className={styles.paragraphs}>
        <p>
        fomo was built as a final project in the <strong>Reykjavík Academy of Web Development</strong>. 
        It is currently in beta and was launched on the 1st of August, 2021.
        </p>

        <p>
        The idea came about
        when the developer was living overseas as an expat and had a hard time finding events in his area. 
        The applications that promised to provide location based events within all failed to do so sufficiently, 
        leaving him surfing instagram pages for posts and story posts.
        </p>
        <p>
        This application is still in development, 
        if you have any questions, suggestions, want to advertise or just have a need to express youself - don’t 
        hesitate to <strong >contact us</strong> via e-mail or social media.
        </p>
        <p>fomo was designed, developed and maintained by web developer <a href="https://alexanderjarl-portfolio.vercel.app/"><strong>Alexander Jarl</strong></a>.</p>
      </div>
  </div>;
}
