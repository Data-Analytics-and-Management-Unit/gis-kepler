import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useRef } from 'react';
import { useEffect, forwardRef } from 'react';
import Image from 'next/image';

import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './NightlightMap.module.scss';
import { useLayoutEffect } from 'react';

const NightlightMap = forwardRef((props, ref) => {

    const mapRef = useRef();
    const intensity = [4, 3, 2];
    const colorMapLight = ["rgba(255, 0, 0, 1)", "rgba(255, 0, 0, .6)", "rgba(255, 0, 0, .4)"];
    const colorMapDark = ["rgba(246, 196, 68, 0.9)", "rgba(228, 149, 56, 0.9)", "rgba(223, 103, 52, .9)"];
    let disabled = false;
    let sharedMapState = props.sharedMapState;

    function addNightlightSource() {
        // console.log(mapRef.current)
        mapRef.current.addSource('nightlight', {
            'type': 'vector',
            'tiles': [
                'https://chatbot.dataspace.mobi/services/nightlight/tiles/{z}/{x}/{y}.pbf'
            ],
            'minzoom': 0,
            'maxzoom': 7
        });
    }

    function addNightlightLayer(year, afterLayer, theme) {
        const map = mapRef.current
        console.log(theme)
        let colorMap = (theme.search('dark') < 0) ? colorMapLight : colorMapDark;

        intensity.forEach((i, idx) => {
            map.addLayer(
                {
                    "id": "nightlight_" + year + "_" + i,
                    "type": "fill",
                    "source": "nightlight",
                    "source-layer": year,
                    "layout": {

                    },
                    "paint": {
                        "fill-color": colorMap[idx],
                        "fill-opacity": props.layerOpacity || 0.9
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

    function linkMaps(to) {
        if(!to) return false;

        mapRef.current.on('movestart', (e) => {
            // console.log('before start: ' + props.id, window._nightlightState)
            if(window._nightlightState == 'neither') {
                // console.log('Start' + props.id)
                window._nightlightState = props.id
            }
        })

        mapRef.current.on('moveend', (e) => {
            if(window._nightlightState == props.id) {
                // console.log('End'+ props.id)
                window._nightlightState = 'neither'
            }
        })
        
        mapRef.current.on('move', (e) => {
            let thisMap = e.target
            let state = window._nightlightState

            // console.log(props.id, window._nightlightState)

            if(!state || state == 'neither') {
                window._nightlightState = props.id
            }

            if(state == props.id) {
                var center = thisMap.getCenter();
                var zoom = thisMap.getZoom();
                var pitch = thisMap.getPitch();
                var bearing = thisMap.getBearing();

                // console.log(to)

                to.forEach(t => {
                    let map_t = t.current.mapRef
                    map_t.setCenter(center);
                    map_t.setZoom(zoom);
                    map_t.setPitch(pitch);
                    map_t.setBearing(bearing);
                })
            }
        })
    }

    function replaceNightlightLayers(from, to, afterLayer, theme) {
        intensity.forEach((i, idx) => {
            mapRef.current.removeLayer("nightlight_" + from + "_" + i)
        })

        addNightlightLayer(to, afterLayer, theme)
    }

    useLayoutEffect(() => {
        let map = new maplibre.Map({
            container: ref.current,
            style: '/styles/' + (props.mapStyle || 'light') + '.json',
            zoom: 8,
            center: [77.170169, 28.467687]
        })
        mapRef.current = map
        ref.current.mapRef = map
        
        // Conditionally add navigation controls
        if(props.displayNavContols) {
            map.addControl(new maplibre.NavigationControl())
        }

    }, [])

    useEffect(() => {
        linkMaps(props.linkMapsToRef);
    }, [props.linkMapsToRef])

    useEffect(() => {
        if(!mapRef.current.year) {
            mapRef.current.on('load', () => {
                if(props.loadWidth) {
                    ref.current.style.width =  props.loadWidth
                }
                
                // Add nightlight source
                addNightlightSource()
                addNightlightLayer(props.nightlightYear, 'airport_label', props.mapStyle)
    
                // console.log(mapRef.current)
            })
        } else {
            console.log(props.mapStyle)
            replaceNightlightLayers(mapRef.current.year, props.nightlightYear, 'airport_label', props.mapStyle)
        }
    }, [props.nightlightYear])

    return (
        <div
            ref={ref}
            className={props.className == undefined ? styles.map_container : props.className} 
            style={props.style}
        >    
        </div>
    )
})

export default NightlightMap;