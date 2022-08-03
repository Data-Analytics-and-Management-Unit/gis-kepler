import { useRef } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import NightlightMap from '../../components/nightlight_map/NightlightMap';

import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '../../styles/Nightlight.module.scss';

function Nightlight() {

    const [topMapYear, setTopMapYear] = useState("1992");
    const [bottomMapYear, setBottomMapYear] = useState("2020");

    const mapContainerTop = useRef()
    const mapContainerBottom = useRef()
    const splitIcon = useRef()
    const mapTopRef = useRef()
    const mapBottomRef = useRef()
    let isDown = false;

    function replaceNightlightLayers(map, from, to, afterLayer) {
        intensity.forEach((i, idx) => {
            map.removeLayer("nightlight_" + from + "_" + i)
        })

        addNightlightLayers(map, to, afterLayer)
    }

    function moveCallback(e) {
        if(!isDown) return

        e.preventDefault()

        splitIcon.current.style.left = (e.clientX - 35) + 'px'

        let topMapContainer = mapContainerTop.current
        topMapContainer.style.width = e.clientX + 'px'
    }

    function interactiveDown() {
        isDown = true
        window.addEventListener('mousemove', moveCallback)
        window.addEventListener('touchmove', moveCallback)
    }

    function interactiveUp() {
        isDown = false
        window.removeEventListener('touchmove', moveCallback)
    }
    
    useEffect(() => {
        splitIcon.current.addEventListener('mousedown', interactiveDown)
        splitIcon.current.addEventListener('touchstart', interactiveDown)
        
        window.addEventListener('mouseup', interactiveUp)
        window.addEventListener('touchend', interactiveUp)
    }, [])

    function onSelectChange(e, mapId) {
        if(mapId === 'top') {
            setTopMapYear(e.target.value)
        } else if(mapId === 'bottom') {
            setBottomMapYear(e.target.value)
        }
        
    }

    function renderTimePeriod(start, end) {
        let res = []
        for(let i = start; i <= end; i++) {
            res.push(
                <option key={i} value={i}>{i}</option>
            )
        }
        return res
    }

    return (
        <>
            <NightlightMap
                id={"map_top"} 
                ref={mapContainerTop}
                mapStyle="dark"
                className={styles.map_container_top}
                nightlightYear={topMapYear}
                linkMapsToRef={[mapContainerBottom]}
                loadWidth="50%"
                layerOpacity={0.8}
            />
            <NightlightMap 
                id={"map_bottom"} 
                ref={mapContainerBottom}
                mapStyle="dark_gray"
                className={styles.map_container_bottom}
                nightlightYear={bottomMapYear}
                linkMapsToRef={[mapContainerTop]}
                layerOpacity={0.8}

            />
            <div className={styles.split_icon} ref={splitIcon}>
                <Image src="/img/split.svg" alt="" width="100%" height="100%" />
            </div>
            
            <div className={styles.select_map_top}>
                <select className={styles.select} name="sel" id="sel" defaultValue="1992" onChange={(e) => onSelectChange(e, 'top')}>
                    <optgroup className={styles.optgroup}>
                        {renderTimePeriod(1992, 2021)}
                    </optgroup>
                </select>
            </div>

            <div className={styles.select_map_bottom}>
                <select className={styles.select} name="sel" id="sel" defaultValue="2021" onChange={(e) => onSelectChange(e, 'bottom')}>
                    <optgroup className={styles.optgroup}>
                        {renderTimePeriod(1992, 2021)}
                    </optgroup>
                </select>
            </div>
        </>
    )
}

export default Nightlight;