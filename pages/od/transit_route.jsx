import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useState } from 'react';
import { useEffect, useRef } from 'react';

import Checkbox from '@mui/material/Checkbox';

import styles from '../../styles/TransitRoute.module.scss';

function TransitRoute() {

    const mapContainerRef = useRef();
    const mapRef = useRef();

    useEffect(() => {
        let map = new maplibre.Map({
            container: mapContainerRef.current,
            style: '/styles/dark.json',
            zoom: 11,
            center: [77.592476, 12.976711]
        })
        mapRef.current = map;

        map.on('load', () => {
            map.addSource('route', {
                'type': 'geojson',
                'data': '/data/mobility/routes_expanded.json'
            })

            map.addLayer({
                'id': 'route_layer',
                'type': 'line',
                'source': 'route',
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': [
                        'interpolate', ['linear'],
                        ['number', ['get', 'speed']],

                        // 0, '#FFFFFF',
                        // 10, '#D50255',
                        // 20, '#FEAD54',
                        // 25, '#FEEDB1',
                        // 30, '#E8FEB5',
                        // 35, '#49E3CE',
                        // 50, '#0198BD'

                        0, '#FFFFFF',
                        10, '#D7191C',
                        20, '#FDAE61',
                        35, '#A6D96A',
                        45, '#1A9641',
                        50, '#0b3f1b'
                    ],
                    'line-width': [
                        'interpolate', ['linear'],
                        ['number', ['get', 'trips']],
                        10, 0.1,
                        200, 2.5
                    ]
                }
            }, 'road_label')  

            map.addSource('stop_reach_15', {
                'type': 'geojson',
                'data': '/data/mobility/isochrone_15_mins.geojson'
            })

            map.addLayer({
                'id': 'stop_reach_15_layer',
                'type': 'fill',
                'source': 'stop_reach_15',
                'layout': {},
                'paint': {
                    'fill-color': '#00ff00',
                    'fill-opacity': 0.4
                }
            }, 'road_label') 
            
            
            map.addSource('stop_reach_5', {
                'type': 'geojson',
                'data': '/data/mobility/isochrone_5_mins.geojson'
            })

            map.addLayer({
                'id': 'stop_reach_5_layer',
                'type': 'fill',
                'source': 'stop_reach_5',
                'layout': {},
                'paint': {
                    'fill-color': '#ff0000',
                    'fill-opacity': 0.4
                }
            }, 'road_label') 
            
            

            map.addSource('stops', {
                'type': 'geojson',
                'data': '/data/mobility/busstops.geojson'
            })

            map.addLayer({
                'id': 'stops_layer',
                'type': 'circle',
                'source': 'stops',
                'paint': {
                    'circle-color': '#11b4da',
                    'circle-radius': 2,
                    'circle-stroke-width': 0.1,
                    'circle-stroke-color': '#fff'
                }
            }, 'road_label')  
        })
    }, [])

    function toggleLayer(id) {
        console.log(id)

        let map = mapRef.current;

        let visibility = map.getLayoutProperty(id, 'visibility');

        console.log(visibility)

        if(visibility === 'visible' || visibility === undefined) {
            map.setLayoutProperty(id, 'visibility', 'none');
        } else {
            map.setLayoutProperty(id, 'visibility', 'visible');
        }
    }

    return (
        <>
            <div ref={mapContainerRef} className="map_container"></div>
            <div className={styles.transit_control_container}>
                <h3>India Urban Observatory</h3>
                <div className={styles.option_box}>
                    <Checkbox defaultChecked size="small" onChange={() => {toggleLayer('route_layer')}} />
                    <span>Bus Routes</span>
                </div>
                <div className={styles.option_box}>
                    <Checkbox defaultChecked size="small" onChange={() => {toggleLayer('stops_layer')}}/>
                    <span>Bus Stops</span>
                </div>
                <div className={styles.option_box}>
                    <Checkbox defaultChecked size="small" onChange={() => {toggleLayer('stop_reach_5_layer')}}/>
                    <span>Reachability of stops with 5 mins walk</span>
                </div>
                <div className={styles.option_box}>
                    <Checkbox defaultChecked size="small" onChange={() => {toggleLayer('stop_reach_15_layer')}}/>
                    <span>Reachability of stops with 15 mins walk</span>
                </div>
            </div>
        </>
    )
}

export default TransitRoute;
