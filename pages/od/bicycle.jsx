import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useState } from 'react';
import { useEffect, useRef } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import styles from '../../styles/TravelTime.module.scss';

function Bicycle() {

    const mapContainerRef = useRef();
    const mapRef = useRef();
    const dataRef = useRef();
    const wardDataRef = useRef();
    const mapClickIdRef = useRef('77');
    const fromPlace = useRef();
    const fromPlaceRef = useRef();
    const infoBoxRef = useRef();
    const toPlaceRef = useRef();
    const timeRef = useRef();
    const distanceRef = useRef();
    const speedTagRef = useRef();

    
    const initWard = {
        bangalore: {
            ward_name: 'Dattatreya Temple',
            ward_no: 77
        }
    }
    
    function fetchNewData(id){
        
        let completeData = dataRef.current
        if(!completeData){
            return
        }
        for (let i=0; i<completeData.features.length; i++){
            let destId = completeData.features[i].properties.id
            let t = wardDataRef.current[id].destinations[destId]?.time || 0
            let d = wardDataRef.current[id].destinations[destId]?.distance || 0
            let dd = wardDataRef.current[id].destinations[destId]?.diff_dist || 0
            let dt = wardDataRef.current[id].destinations[destId]?.diff_time || 0
            completeData.features[i].properties.time = t
            completeData.features[i].properties.distance = d 
            completeData.features[i].properties.diff_dist = dd
            completeData.features[i].properties.diff_time = dt
        }
        mapRef.current.getSource('ward').setData(completeData)
    }

    function renderTime(timeHour) {

        let timeSec = timeHour * 3600

        if(timeSec === 0) {
            return 'Data not available'
        }

        let min = (timeSec / 60).toFixed(0)
        let res = 0
        if(min < 60) {
            return min + ' mins'
        } else {
            return (min / 60).toFixed(0) + ' hrs ' + (min % 60) + ' mins'
        }
    }
    
    function renderLegend() {
        let colors = ['FFFFDD', 'D0E8B9', '9ED1BB', '6CB8C1', '4E9BBD', '3D7DB2', '3260A4', '244685', '182F69', '091A4A', '000125']
        let text = ['1 mins', '5 mins', '12 mins', '17 mins', '22 mins', '25 mins', '34 mins', '42 mins', '50 mins', '59 mins', '> 1hr']
        let res = []
        let textArea

        for(let i=0; i<colors.length; i++) {
            textArea = undefined
            if(i % 2 == 0) {
                textArea = <p>{text[i]}</p>
            }
            res.push(
                <div
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

    useEffect(()=>{
        let map = new maplibre.Map({
            container: mapContainerRef.current,
            style: '/styles/mute.json',
            zoom: 11,
            center: [77.592476, 12.976711]
        })
        mapRef.current = map;
        let dataPromise = fetch('/data/cycle_data/init_ward.json')
        let wardPromise = fetch('/data/cycle_data/ward_wise_data.json')
        map.on('load',()=>{
            wardPromise.then(res => res.json()).then(wardData=>{
                wardDataRef.current = wardData
            })
            dataPromise.then(res => res.json()).then(completeData=>{
                dataRef.current = completeData
                map.addSource('ward',{
                    type: 'geojson',
                    data: completeData
                })
                map.addLayer({
                    id: 'ward_layer',
                    type: 'fill',
                    source: 'ward',
                    layout: {},
                    paint: {
                        'fill-color': [
                            "case",
                            ["in", ["get", "id"], ["literal", ["5","13","32","33","36","37","42","43","47","48","68","69","70","71","72","73","74","75","99","100","101","102","103","107","126","127","141"]]], '#696969',
                            [
                                'interpolate', ['linear'],
                                ['number', ['get', 'time']],
                                0, '#FFFFFF',
                                100, '#FFFFDD',
                                300, '#D0E8B9', 
                                700,'#9ED1BB', 
                                1000, '#6CB8C1', 
                                1300, '#4E9BBD',
                                1500, '#3D7DB2',
                                2000, '#3260A4',
                                2500, '#244685',
                                3000, '#182F69',
                                3500, '#091A4A',
                                4500, '#000125',
                            ]
                        ],
                        'fill-opacity': [
                            "case",
                            ["in", ["get", "id"], ["literal", ["5","13","32","33","36","37","42","43","47","48","68","69","70","71","72","73","74","75","99","100","101","102","103","107","126","127","141"]]], 0.8,
                            [
                                "case",
                                [">",["get","time"],0],0.8,
                                0.4
                            ]
                        ],
                        'fill-outline-color': '#6E91BE'
                    }
                }, 'road_trunk_primary')

                map.on('click', 'ward_layer', (e)=>{
                    let id = e.features[0].properties.id
                    mapClickIdRef.current = id
                    console.log(mapClickIdRef.current)
                    fromPlace.current = e.features[0].properties.name
                    fetchNewData(id)
                    fromPlaceRef.current.innerHTML = 'From ' + (fromPlace.current || initWard.bangalore.ward_name) + ' to'
                })
                map.on('mouseenter', 'ward_layer', function(e){
                    map.getCanvas().style.cursor = 'pointer';
                });
                map.on('mousemove', 'ward_layer', (e)=>{
                    infoBoxRef.current.style.display = 'block'
                    let time = e.features[0].properties.time / 3600
                    let distance = e.features[0].properties.distance / 1000
                    let d_dist = e.features[0].properties.diff_dist / 1000

                    let d_time = e.features[0].properties.diff_time / 3600
                    let speed = distance / time
                    let n_time = d_dist / speed
                    let speedTag = speed.toFixed(1) + ' kmph'
                    fromPlaceRef.current.innerHTML = 'From ' + (fromPlace.current || initWard.bangalore.ward_name) + ' to'
                    toPlaceRef.current.innerHTML = e.features[0].properties.name
                    distanceRef.current.innerHTML = d_dist.toFixed(1) + ' km'
                    speedTagRef.current.innerHTML = speedTag
                    timeRef.current.innerHTML = renderTime(n_time)
                    
                })
                map.on('mouseleave', 'ward_layer', function (e) {
                    map.getCanvas().style.cursor = '';
                });
            })
        })
    },[])
    return (
        <>
            <div ref={mapContainerRef} className="map_container"></div>
            <div className={styles.iuo_title}>
                India Urban Observatory
            </div>
            <div className={styles.controller_container}>
                <h1 className={styles.heading}>Impact of cycling as a transport mode on travel time</h1>
                <FormControl 
                    fullWidth 
                    style={{
                        'marginTop': '10px',
                        'marginBottom': '10px'
                    }}
                >
                    <InputLabel id="select-city">City</InputLabel>
                    <Select
                    labelId="select-city"
                    id="select-city-label"
                    value={10}
                    label="City"
                    onChange={() => {}}
                    >
                        <MenuItem value={10}>Bangalore</MenuItem>
                    </Select>   
                </FormControl>
                <p className={styles.detail_info}>This visualisation gives an overview of travel time within different wards of Bangalore by cycling.</p>
                <p className={styles.detail_info}>It shows you various time and distance dependant indicators like average speed of the trip</p>
                <p className={styles.detail_info}>Time and distance is computed from one centroid point of a ward to another.</p>
            </div>
            <div
            ref={infoBoxRef}
            className={styles.info_box}>
                <div className={styles.imp_info_container}>
                    <p ref={fromPlaceRef}></p>
                    <h2 ref={toPlaceRef}></h2>
                    <h3 ref={timeRef}></h3>
                    <h3 ref={distanceRef}></h3>
                </div>
                <div className={styles.stats_box}>
                    <div className={styles.speed_tag_container}>
                        <div>
                            <img src="/img/speed.svg" alt="" />
                        </div>
                        <div>
                            <p>Average Speed</p>
                            <h3 ref={speedTagRef}></h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.legend}>
                {renderLegend()}
            </div>
        </>
    )
}


export default Bicycle;