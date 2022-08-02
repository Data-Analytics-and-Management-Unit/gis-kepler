import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useRef } from 'react';
import { useEffect } from 'react';

import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '../../styles/Nightlight.module.scss';

function Nightlight() {

    const mapContainerTop = useRef()
    const mapContainerBottom = useRef()
    const splitIcon = useRef()
    const mapTopRef = useRef()
    const mapBottomRef = useRef()

    const intensity = [4, 3, 2]

    function addNightlightLayers(map, year, afterLayer) {
        var colorMap = ["rgba(255, 0, 0, 1)", "rgba(255, 0, 0, .6)", "rgba(255, 0, 0, .4)"]

        intensity.forEach((i, idx) => {
            map.addLayer(
                {
                    "id": "nightlight_" + year + "_" + i,
                    "type": "fill",
                    "source": "niua-nightlight",
                    "source-layer": year,
                    "layout": {

                    },
                    "paint": {
                        "fill-color": colorMap[idx],
                        "fill-opacity": 0.4
                    },
                    "filter": [
                        "all",
                        [
                            "==",
                            "intensity",
                            i
                        ]
                    ]
                },
                afterLayer
            );
        })
        map.year = year
    }

    function addSourceLayers(map, afterLayer) {
        // var colorMap = ["rgba(19, 0, 107, 1)", "rgba(161, 162, 0, 1)", "rgba(175, 0, 0, 1)"]
        
        // console.log(map.year)

        map.addSource('niua-nightlight', {
            'type': 'vector',
            'tiles': [
                'https://chatbot.dataspace.mobi/services/nightlight/tiles/{z}/{x}/{y}.pbf'
            ],
            'minzoom': 0,
            'maxzoom': 7
        });

        addNightlightLayers(map, map.year, afterLayer)
        
        return map
    }

    function replaceNightlightLayers(map, from, to, afterLayer) {
        intensity.forEach((i, idx) => {
            map.removeLayer("nightlight_" + from + "_" + i)
        })

        addNightlightLayers(map, to, afterLayer)
    }
    
    useEffect(() => {
        let mTop = new maplibre.Map({
            container: mapContainerTop.current,
            style: '/styles/default.json',
            zoom: 8,
            center: [77.170169, 28.467687]
        })
        mTop['year'] = '1992'
        mapTopRef.current = mTop

        let mBottom = new maplibre.Map({
            container: mapContainerBottom.current,
            style: '/styles/dark.json',
            zoom: 8,
            center: [77.170169, 28.467687]
        })
        mBottom['year'] = '2020'
        mapBottomRef.current = mBottom
        // m.addControl(new maplibre.NavigationControl())

        mTop.on('load', (e) => {
            let top_ele = mapContainerTop.current
            top_ele.style.width = "50%"
            // console.log(top_ele.style)

            addSourceLayers(e.target, 'water_name_line')
        })

        mBottom.on('load', (e) => {
            addSourceLayers(e.target, 'water_name_line')
        })

        let disabled = false;
        function linkMaps(first, second) {
            first.on('move', (e) => {
                var thisMap = e.target

                if(!disabled) {
                    var center = thisMap.getCenter();
                    var zoom = thisMap.getZoom();
                    var pitch = thisMap.getPitch();
                    var bearing = thisMap.getBearing();
    
                    disabled = true;
                    second.setCenter(center);
                    second.setZoom(zoom);
                    second.setPitch(pitch);
                    second.setBearing(bearing);
                    disabled = false;
                }

                
            })
        }

        // console.log('link called')
        linkMaps(mTop, mBottom)
        linkMaps(mBottom, mTop)

        let isDown = false;

        function moveCallback(e) {
            // console.log(e)
            if(!isDown) return

            e.preventDefault()

            
            splitIcon.current.style.left = (e.clientX - 35) + 'px'

            let top_ele = mapContainerTop.current
            top_ele.style.width = e.clientX + 'px'

            // console.log(splitIcon.current.style)
        }

        splitIcon.current.addEventListener('mousedown', (e) => {
            // console.log(e)
            isDown = true

            window.addEventListener('mousemove', moveCallback)
        })

        window.addEventListener('mouseup', (e) => {
            isDown = false

            window.removeEventListener('mousemove', moveCallback)
        })
    }, [])

    function onSelectChange(e, map) {
        // console.log(map['year'], e.target.value)
        replaceNightlightLayers(map, map.year, e.target.value, 'water_name_line')
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
            <div className={styles.map_container_top} ref={mapContainerTop}></div>
            <div className={styles.map_container_bottom} ref={mapContainerBottom}></div>
            <img className={styles.split_icon} ref={splitIcon} src="/img/split.svg" alt="" />
            <div className={styles.select_map_top}>
                <select className={styles.select} name="sel" id="sel" defaultValue="1992" onChange={(e) => onSelectChange(e, mapTopRef.current)}>
                    <optgroup className={styles.optgroup}>
                        {renderTimePeriod(1992, 2021)}
                    </optgroup>
                </select>
            </div>

            <div className={styles.select_map_bottom}>
                <select className={styles.select} name="sel" id="sel" defaultValue="2021" onChange={(e) => onSelectChange(e, mapBottomRef.current)}>
                    <optgroup className={styles.optgroup}>
                        {renderTimePeriod(1992, 2021)}
                    </optgroup>
                </select>
            </div>
        </>
    )
}

export default Nightlight;