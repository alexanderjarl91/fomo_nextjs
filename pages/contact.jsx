import React from 'react'
import styles from "../styles/Contact.module.css";

export default function Contact() {
    return (
        <div className={styles.container}>

            <h1>We'd love to hear from you!</h1>
            <div className={styles.paragraphs}>
                <p>
                Currently we only answer via e-mail or social media. Feel free to hit us up, we’ll answer as soon as possible!
                </p>
                <a href="mailto:alexander@pippen.is">alexander@pippen.is</a>
                <a target="_blank" href="https://www.instagram.com/fomoxevents">fomo on Instagram</a>
                <a target="_blank"  href="https://www.facebook.com/www.fomo.events">fomo on Facebook</a>
            </div>    
        </div>
    )
}
