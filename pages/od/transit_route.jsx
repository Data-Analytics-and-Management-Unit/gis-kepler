import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useState } from 'react';
import { useEffect, useRef } from 'react';

import Checkbox from '@mui/material/Checkbox';

import styles from '../../styles/TransitRoute.module.scss';

function TransitRoute() {

    const mapContainerRef = useRef();
    const mapRef = useRef();
    const tooltipRef = useRef();
    const legendRoutesRef = useRef();
    const legendUnservedRef = useRef();
    const legendTtiRef = useRef();
    const layerVisibleRef = useRef();

    useEffect(() => {
        let map = new maplibre.Map({
            container: mapContainerRef.current,
            style: '/styles/dark.json',
            zoom: 11,
            center: [77.592476, 12.976711]
        })
        mapRef.current = map;

        map.on('load', () => {

            map.addSource('unserved_area_percentage', {
                'type': 'geojson',
                'data': '/data/mobility/unserved_area_percentage.geojson'
            })

            map.addLayer({
                'id': 'unserved_area_percentage_layer',
                'type': 'fill',
                'source': 'unserved_area_percentage',
                'layout': {
                    'visibility': 'none',
                },
                'paint': {
                    'fill-color': [
                        'interpolate', ['linear'],
                        ['number', ['get', 'per_area_unserved']],
                        0, '#F1EEF6',
                        10, '#D0D1E6',
                        20, '#A6BDDB', 
                        40,'#74A9CF', 
                        60, '#2B8CBE', 
                        80, '#045A8D'
                    ],
                    'fill-opacity': 0.8
                }
            }, 'road_label') 

            map.addSource('tti', {
                'type': 'geojson',
                'data': '/data/mobility/tti.geojson'
            })

            map.addLayer({
                'id': 'tti_layer',
                'type': 'fill',
                'source': 'tti',
                'layout': {
                    'visibility': 'none',
                },
                'paint': {
                    'fill-color': [
                        'interpolate', ['linear'],
                        ['number', ['get', 'tti']],
                        0.5, '#F1EEF6',
                        1.0, '#A6BDDB', 
                        1.5,'#74A9CF', 
                        1.7, '#2B8CBE', 
                        1.9, '#045A8D'
                    ],
                    // 'fill-color': [
                    //     "step",
                    //     ["get", "tti"],
                    //     "#f1eef6",
                    //     0,
                    //     "#FFC300",
                    //     0.9,
                    //     "#F1920E",
                    //     1.2,
                    //     "#E3611C",
                    //     1.5,
                    //     "#C70039",
                    //     1.7,
                    //     "#900C3F",
                    //     2,
                    //     "#5A1846"
                    //   ],
                    'fill-opacity': 0.8
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
                'layout': {
                    'visibility': 'none',
                },
                'paint': {
                    'fill-color': '#F2C644',
                    'fill-opacity': 0.8
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
                'layout': {
                    'visibility': 'none',
                },
                'paint': {
                    'fill-color': '#c3294f',
                    'fill-opacity': 0.8
                }
            }, 'road_label') 

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
                        25, '#A6D96A',
                        35, '#1A9641',
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
            
            

            map.addSource('stops', {
                'type': 'geojson',
                'data': '/data/mobility/busstops.geojson'
            })

            map.addLayer({
                'id': 'stops_layer',
                'type': 'circle',
                'source': 'stops',
                'layout': {
                    'visibility': 'none',
                },
                'paint': {
                    'circle-color': '#fff',
                    'circle-radius': 2,
                    'circle-stroke-width': 0.1,
                    'circle-stroke-color': '#fff'
                }
            }, 'road_label') 

            map.on('mousemove', 'unserved_area_percentage_layer', (e) => {

                tooltipRef.current.style.top = (e.point.y + 20) + 'px'
                tooltipRef.current.style.left = (e.point.x + 20) + 'px'
                tooltipRef.current.style.display = 'block'
                tooltipRef.current.innerHTML = '<p><span>Percent area unserved: </span>' + e.features[0].properties.per_area_unserved + '</p>' + '<p><span>Ward Name: </span>' + e.features[0].properties.ward_name + '</p>'
            })

            map.on('mousemove', 'tti_layer', (e) => {

                tooltipRef.current.style.top = (e.point.y + 20) + 'px'
                tooltipRef.current.style.left = (e.point.x + 20) + 'px'
                tooltipRef.current.style.display = 'block'
                tooltipRef.current.innerHTML = '<p><span>Travel Time Index: </span>' + e.features[0].properties.tti + '</p>' + '<p><span>Ward Name: </span>' + e.features[0].properties.name + '</p>'
            })

            legendRoutesRef.current.style.visibility = 'visible'
            layerVisibleRef.current = {
                'route_layer': true,
                'unserved_area_percentage_layer': false,
                'tti_layer': false
            }
            
            
            
        })
    }, [])

    function toggleLayer(id) {
        console.log(id)

        let map = mapRef.current;

        let visibility = map.getLayoutProperty(id, 'visibility');

        console.log(visibility)

        legendRoutesRef.current.style.visibility = 'hidden'
        legendTtiRef.current.style.visibility = 'hidden'
        legendUnservedRef.current.style.visibility = 'hidden'

        if(visibility === 'visible' || visibility === undefined) {
            map.setLayoutProperty(id, 'visibility', 'none');
            tooltipRef.current.style.display = 'none'
            layerVisibleRef.current[id] = false

            let idToShow;
            Object.keys(layerVisibleRef.current).forEach((k) => {
                if(layerVisibleRef.current[k]) {
                    idToShow = k
                }
            })
            setVisibilityProp(idToShow, 'visible')
        } else {
            map.setLayoutProperty(id, 'visibility', 'visible');

            layerVisibleRef.current[id] = true
            setVisibilityProp(id, 'visible')
        }
    }

    function setVisibilityProp(layer_name, vis) {
        if(layer_name === 'route_layer') {
            legendRoutesRef.current.style.visibility = vis
        } else if(layer_name === 'unserved_area_percentage_layer') {
            legendUnservedRef.current.style.visibility = vis
        } else if(layer_name === 'tti_layer') {
            legendTtiRef.current.style.visibility = vis
        }
    }

    function renderLegend(id) {
        let colors = ['D7191C', 'FDAE61', 'A6D96A', '1A9641', '0b3f1b']
        let text = ['10 kmph', '20', '25', '35', '50']
        let res = []
        let textArea

        if(id === 'tti') {
            colors = ['F1EEF6', 'A6BDDB', '74A9CF', '2B8CBE', '045A8D']
            text = ['0.5 TTI', '1.0', '1.5', '1.7', '2.0']
        } else if(id === 'unserved') {
            colors = ['F1EEF6', 'D0D1E6', 'A6BDDB', '74A9CF', '045A8D']
            text = ['10 percent', '20', '40', '60', '80']
        }

        for(let i=0; i<colors.length; i++) {
            textArea = undefined
            textArea = <p>{text[i]}</p>

            res.push(
                <div
                    key={i}
                    style={{
                        backgroundColor: '#' + colors[i]
                    }} 
                    className={styles.legend_box}
                >
                    {textArea}
                </div>
            )
        }
        return res
    }

    return (
        <>
            <div ref={mapContainerRef} className="map_container"></div>
            <div className={styles.transit_control_container}>
                <h3>India Urban<br/>Observatory</h3>
                <h4>Public transit reachability<br/>analysis</h4>
                <div className={styles.option_container}>
                    <div className={styles.option_box}>
                        <Checkbox size="small" onChange={() => {toggleLayer('stops_layer')}}/>
                        <span className={styles.layer_name}>Bus Stops</span>
                    </div>
                    <div className={styles.option_box}>
                        <Checkbox size="small" onChange={() => {toggleLayer('stop_reach_5_layer')}}/>
                        <span className={styles.layer_name}>Reachability within 5 mins</span>
                    </div>
                    <div className={styles.option_box}>
                        <Checkbox size="small" onChange={() => {toggleLayer('stop_reach_15_layer')}} />
                        <span className={styles.layer_name}>Reachability in 15 mins</span>
                    </div>
                    <div className={styles.option_box}>
                        <Checkbox defaultChecked size="small" onChange={() => {toggleLayer('route_layer')}} />
                        <span className={styles.layer_name}>Trips and speed on public transit</span>
                    </div>
                    <div className={styles.option_box}>
                        <Checkbox size="small" onChange={() => {toggleLayer('unserved_area_percentage_layer')}} />
                        <span className={styles.layer_name}>Unserved Areas</span>
                    </div>
                    <div className={styles.option_box}>
                        <Checkbox size="small" onChange={() => {toggleLayer('tti_layer')}} />
                        <span className={styles.layer_name}>Travel Time Index from Majestic</span>
                    </div>
                </div>
            </div>
            <div ref={legendRoutesRef} className={styles.legend}>
                {renderLegend('routes')}
            </div>
            <div ref={legendUnservedRef} className={styles.legend}>
                {renderLegend('unserved')}
            </div>
            <div ref={legendTtiRef} className={styles.legend}>
                {renderLegend('tti')}
            </div>
            <div className={styles.tooltip} ref={tooltipRef}></div>
        </>
    )
}

export default TransitRoute;
