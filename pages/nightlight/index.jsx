import Link from 'next/link';
import Head from 'next/head';

import styles from '../../styles/Nightlight.module.scss';

function NightlightLanding() {

    return (
        <section className={styles.landingPage}>
            <Head>
                <title>Urbanisation in India through nightlight</title>
            </Head>
            <div className={styles.page_header}>
                <h1>India Urban <span>Observatory</span></h1>
                <div className={styles.logo_container}>
                    <img src="/img/logos/niua.svg" alt="" />
                    <img src="/img/logos/scm.svg" alt="" />
                    <img src="/img/logos/mohua.svg" alt="" />
                </div>
            </div>
            <div className={styles.viz_container}>
                <Link href="/nightlight/compare_four_years">
                    <div className={styles.viz_box + ' ' + styles.viz_box_left}>
                        <img className={styles.left_viz} src={"/img/four_years.png"} alt="" />
                        <h2>Comparing 30 years of Indian urban growth through nightlight data</h2>
                    </div>
                </Link>
                <Link href="/nightlight/compare_between_two_years">
                    <div className={styles.viz_box + ' ' + styles.viz_box_right}>
                        <img className={styles.right_viz} src={"/img/two_years.png"} alt="" />
                        <h2>Difference in urbanisation in India through nightlight data</h2>
                    </div>
                </Link>
            </div>
            {/* <h1>hi</h1> */}
        </section>
    )
}

export default NightlightLanding;