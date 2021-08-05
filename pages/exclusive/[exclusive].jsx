import React from 'react'
import { useRouter } from "next/router"
import styles from "../../styles/Exclusive.module.css";


export default function exclusive() {
    const router = useRouter()
    const eventTitle = router.query.exclusive


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>{eventTitle}</h1>
                <h2 style={{ textAlign: 'center' }} className={styles.subtitle}>(exclusive event)</h2>
                <div className={styles.img__container}>
                    <img src="/staff.jpg" alt="" />
                </div>
                <h3 className={styles.subtitle}>Event Info</h3>
                <ul className={styles.info__list}>
                    <li><img src="/exclusive_icons/MapPinLine.svg" alt="" /><p>Harpan</p></li>
                    <li><img src="/exclusive_icons/Calendar.svg" alt="" /><p>4sept</p></li>
                    <li><img src="/exclusive_icons/Clock.svg" alt="" /><p>19:15</p></li>
                    <li><img src="/exclusive_icons/Profile.svg" alt="" /><p>Origo</p></li>
                </ul>


                <h3 className={styles.subtitle}>Description</h3>
                <p className={styles.text}>Núna er loksins komið að því!!
                    Félagar Nörd munu koma saman og skemmta sér konunglega í tilefni þess að við erum öll snillingar og höfum verið svo þæg og góð allt árið! Dagurinn verður haldinn heilagur úti á landsbyggðinni alla leiðina á Hótel Selfoss! Við munum smella inn bílaskjali fyrir þau sem vilja deila bíl með öðrum og einfalda því förina fyrir öll! Þemað í ár er Get-Away Grímuball en ekki er skylda að mæta í stíl við þemað. Það verða veigar í boði og þegar þær klárast verður að sjálfsögðu eitthvað til á barnum! ❤

                    Skráning hefst á mánudaginn 15. mars klukkan 13:37!
                    Takið daginn frá því þetta er skemmtilegasti viðburður ársins!</p>

                <button className={styles.buy__button}>KAUPA MIÐA</button>
                <p onClick={() => {
                    router.push('/')
                }} className={styles.tiny__text}> þessi viðburður er hýstur á <strong>fomo</strong></p>
            </div>
        </div>
    )
}
