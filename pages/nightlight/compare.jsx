import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useRef } from 'react';
import { useEffect } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '../../styles/Nightlight.module.scss';
import NightlightMap from '../../components/nightlight_map/NightlightMap';

function NightlightCompare() {

    const mapContainerRef1 = useRef();
    const mapContainerRef2 = useRef();
    const mapContainerRef3 = useRef();
    const mapContainerRef4 = useRef();

    return (
        <>
            <NightlightMap 
                id="map_1"
                ref={mapContainerRef1}
                className={styles.nightlight_1_4}
                nightlightYear={"1992"}
                linkMapsToRef={[mapContainerRef2, mapContainerRef3, mapContainerRef4]}
                mapStyle="dark"
            />
            <NightlightMap 
                id="map_2"
                ref={mapContainerRef2}
                className={styles.nightlight_1_4 + ' ' + styles.nightlight_2}
                nightlightYear={"2002"}
                linkMapsToRef={[mapContainerRef1, mapContainerRef3, mapContainerRef4]}
                mapStyle="dark"
            />
            <NightlightMap 
                id="map_3"
                ref={mapContainerRef3}
                className={styles.nightlight_1_4 + ' ' + styles.nightlight_3}
                nightlightYear={"2012"}
                linkMapsToRef={[mapContainerRef1, mapContainerRef2, mapContainerRef4]}
                mapStyle="dark"
            />
            <NightlightMap 
                id="map_4"
                ref={mapContainerRef4}
                className={styles.nightlight_1_4 + ' ' + styles.nightlight_4}
                nightlightYear={"2020"}
                linkMapsToRef={[mapContainerRef1, mapContainerRef2, mapContainerRef3]}
                mapStyle="dark"
            />
            <div className={styles.compare_year_container}>
                <div className={styles.year_container}>
                    <div>1992</div>
                </div>
                <div className={styles.year_container}>
                    <div>2002</div>
                </div>
                <div className={styles.year_container}>
                    <div>2012</div>
                </div>
                <div className={styles.year_container}>
                    <div>2020</div>
                </div>
            </div>
        </>
    )
}

export default NightlightCompare;