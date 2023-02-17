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

function TravelTime() {

    const mapClickIdRef = useRef();
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const dataRef = useRef();
    const infoBoxRef = useRef();
    const fromPlace = useRef();
    const fromPlaceRef = useRef();
    const toPlaceRef = useRef();
    const timeRef = useRef();
    const distanceRef = useRef();
    const speedTagRef = useRef();
    const petrolCostRef = useRef();
    const dieselCostRef = useRef();
    const petrolConRef = useRef();
    const dieselConRef = useRef();
    const petrolCo2Ref = useRef();
    const dieselCo2Ref = useRef();
    const evCo2Ref = useRef();
    const evCostRef = useRef();
    const transitCostRef = useRef();

    

    const [modeState, setModeState] = useState('driving');
    const [statsState, setStatsState] = useState('average_travel_time');

    const mode = useRef(modeState);
    const stats = useRef(statsState);

    // const apiEndpointFulldata = 'http://localhost:8000/od_api/get_od_data_json'
    // const apiEndpointPartialdata = 'http://localhost:8000/od_api/get_od_data'
    const apiEndpointFulldata = 'https://gis.iuo.dataspace.mobi/od_api/get_od_data_json'
    const apiEndpointPartialdata = 'https://gis.iuo.dataspace.mobi/od_api/get_od_data'

    const initWard = {
        bangalore: {
            ward_name: 'Dattatreya Temple',
            ward_no: 77
        }
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

    function handleModeChange(e) {
        console.log('change mode')
        mode.current = e.target.value
        setModeState(e.target.value)
        infoBoxRef.current.style.display = 'none'

        if(e.target.value == 'transit') {
            stats.current = 'average_travel_time'
            setStatsState('average_travel_time')
        }
    }

    function handleStatsChange(e) {
        console.log('change stats')
        stats.current = e.target.value
        setStatsState(e.target.value)
        infoBoxRef.current.style.display = 'none'
    }

    useEffect(() => {
        let map = new maplibre.Map({
            container: mapContainerRef.current,
            style: '/styles/mute.json',
            zoom: 11,
            center: [77.592476, 12.976711]
        })
        mapRef.current = map;

        mapClickIdRef.current = initWard.bangalore.ward_no
        let dataPromise = fetch(apiEndpointFulldata + '?id=' + initWard.bangalore.ward_no + '&mode=' + mode.current + '&stats=' + stats.current)

        map.on('load', () => {

            dataPromise
                .then(res => res.json())
                .then(completeData => {

                    dataRef.current = completeData
                
                    map.addSource('ward', {
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
                                'interpolate', ['linear'],
                                ['number', ['get', 'time']],

                                // 0, '#FFFFFF',
                                // 100, '#FFFFDD',
                                // 300, '#D0E8B9', 
                                // 700,'#9ED1BB', 
                                // 1000, '#6CB8C1', 
                                // 1300, '#4E9BBD',
                                // 1500, '#3D7DB2',
                                // 2000, '#3260A4',
                                // 4000, '#244685',
                                // 6000, '#182F69',
                                // 8000, '#091A4A',
                                // 10800, '#000125',

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
                                
                                // 0, '#FFFFFF',
                                // 10, '#FFFFFF',
                                // 300, '#4584C0',
                                // 1000, '#5AA7E8',
                                // 1500, '#77BCE9',
                                // 2000, '#ADD2E9',
                                // 2500, '#E2E2E2',
                                // 3000, '#D6A897',
                                // 3500, '#CE745C',
                                // 4000, '#D0553D',
                                // 5000, '#B34330'

                                // 0,"#ffffff",
                                // 10,"#ffffff",
                                // 300,"#ffb400",
                                // 1000,"#d2980d",
                                // 1500,"#a57c1b",
                                // 2000,"#786028",
                                // 2500,"#363445",
                                // 3000,"#48446e",
                                // 3500,"#5e569b",
                                // 4000,"#776bcd",
                                // 5000,"#9080ff"

                                // 0,"#ffffff",
                                // 10,"#ffffff", 
                                // 300,"#54bebe",
                                // 1000,"#76c8c8",
                                // 1500,"#98d1d1",
                                // 2000,"#badbdb",
                                // 2500,"#dedad2",
                                // 3000,"#e4bcad",
                                // 3500,"#df979e",
                                // 4000,"#d7658b",
                                // 5000,"#c80064"
                            ],
                            'fill-opacity': 0.8,
                            'fill-outline-color': '#6E91BE'
                        }
                    }, 'road_trunk_primary')
                })
        
                map.on('click', 'ward_layer', e => {
                    
                    let id = e.features[0].properties.id
                    mapClickIdRef.current = id
                    //console.log(e.features[0])

                    fromPlace.current = e.features[0].properties.name

                    // fetch(apiEndpointPartialdata + '?id=' + id + '&mode=' + mode + '&stats=' + stats)
                    //     .then(res => res.json())
                    //     .then(partialData => {
                    //         let completeData = dataRef.current
                    //         for(let i=0; i<completeData.features.length; i++) {
                    //             let destId = completeData.features[i].properties.id
                    //             let t = partialData.destinations[destId]?.time || 0
                    //             let d = partialData.destinations[destId]?.distance || 0
                    //             completeData.features[i].properties.time = t
                    //             completeData.features[i].properties.distance = d
                    //         }
                    //         map.getSource('ward').setData(completeData);
                    //     })

                    fetchNewData(id, mode.current, stats.current)
                });
        
                map.on('mouseenter', 'ward_layer', function (e) {
                    map.getCanvas().style.cursor = 'pointer';
                    // console.log()
                });

                map.on('mousemove', 'ward_layer', (e) => {
                    infoBoxRef.current.style.display = 'block'
                    // infoBoxRef.current.style.top = e.point.y + 'px'
                    // infoBoxRef.current.style.left = e.point.x + 'px'

                    // console.log(infoBoxRef.current.style)

                    // Paper: http://ijtte.com/uploads/2015-12-22/935be804-3a4a-3e79IJTTE_Vol%205(4)_10.pdf

                    let dieselPrice = 95 // Rs / L
                    let petrolPrice = 110 // Rs / L

                    let petrolCo2Emission = 2347.69813574 // grams CO2 / L
                    let dieselCo2Emission = 2689.27276041 // grams CO2 / L
                    let electricCo2Emission = 57.6699029126 // grams CO2 / km

                    let time = e.features[0].properties.time / 3600
                    let distance = e.features[0].properties.distance / 1000
                    let speed = distance / time
                    // 5000 mm / km of roughness
                    let steadyStateFuelConsumptionPetrol = 30 + 844.085 / speed + 0.003 * speed ** 2 + 0.001 * 5000
                    let steadyStateFuelConsumptionDiesel = 35 + 983.503 / speed + 0.002 * speed ** 2 + 0.001 * 5000

                    let petrolCongestionFactor = 0.0003 * speed ** 2 - 0.0344 * speed + 1.9555
                    let dieselCongestionFactor = 0.0005 * speed ** 2 - 0.0609 * speed + 2.8175

                    let petrolConsumption = steadyStateFuelConsumptionPetrol * distance / 1000 // in L
                    let dieselConsumption = steadyStateFuelConsumptionDiesel * distance / 1000 // in L

                    petrolConsumption = petrolConsumption * petrolCongestionFactor
                    dieselConsumption = dieselConsumption * dieselCongestionFactor

                    let petrolCo2 = petrolConsumption * petrolCo2Emission
                    let diesellCo2 = dieselConsumption * dieselCo2Emission

                    let speedTag = speed.toFixed(1) + ' kmph'
                    // let petrolCost = '<p>Petrol Cost: ₹ ' + (e.features[0].properties.distance / 1000 * 4.35).toFixed(1) + '</p>'
                    let petrolCost = (petrolConsumption * petrolPrice).toFixed(1)
                    let dieselCost = (steadyStateFuelConsumptionDiesel * distance / 1000 * dieselPrice).toFixed(1)
                    let evCost = (distance * 1.17).toFixed(1)
                    let transitCost = e.features[0].properties.fare

                    let petrolConsumptionTag = petrolConsumption.toFixed(1) + ' L'
                    let dieselConsumptionTag = dieselConsumption.toFixed(1) + ' L'
                    
                    let petrolCo2Tag = (petrolCo2 / 1000).toFixed(1) + ' kg'
                    let dieselCo2Tag = (diesellCo2 / 1000).toFixed(1) + ' kg'
                    let electricCo2Tag = (electricCo2Emission * distance / 1000).toFixed(1) + ' kg'

                    

                    // infoBoxRef.current.innerHTML = '<p> From ' + fromPlace.current + ' to</p>' + '<h2>' + e.features[0].properties.name + '</h2>' + '<h3>' + renderTime(time) + '</h3>' + speedTag + petrolCost + dieselCost + evCost + petrolConsumptionTag + dieselConsumptionTag + petrolCo2Tag + dieselCo2Tag + electricCo2Tag
                
                    fromPlaceRef.current.innerHTML = 'From ' + (fromPlace.current || initWard.bangalore.ward_name) + ' to'
                    toPlaceRef.current.innerHTML = e.features[0].properties.name
                    timeRef.current.innerHTML = renderTime(time)
                    distanceRef.current.innerHTML = distance.toFixed(1) + ' km'
                    speedTagRef.current.innerHTML = speedTag
                    
                    if(mode.current === 'driving') {
                        petrolCostRef.current.innerHTML = petrolCost
                        dieselCostRef.current.innerHTML = dieselCost
                        evCostRef.current.innerHTML = evCost
                        petrolConRef.current.innerHTML = petrolConsumptionTag
                        dieselConRef.current.innerHTML = dieselConsumptionTag
                        petrolCo2Ref.current.innerHTML = petrolCo2Tag
                        dieselCo2Ref.current.innerHTML = dieselCo2Tag
                        evCo2Ref.current.innerHTML = electricCo2Tag
                    } else if(mode.current === 'transit') {
                        transitCostRef.current.innerHTML = 'Rs ' + transitCost
                    }
                })
                     
                map.on('mouseleave', 'ward_layer', function (e) {
                    map.getCanvas().style.cursor = '';
                });
            });
    }, [])

    function fetchNewData(id, mode, stats) {
        let completeData = dataRef.current

        if(!completeData) {
            return
        }

        //console.log(mode, stats)
        //console.log(mapRef.current.getSource('ward'))
        fetch(apiEndpointPartialdata + '?id=' + id + '&mode=' + mode + '&stats=' + stats)
        .then(res => res.json())
        .then(partialData => {
            for(let i=0; i<completeData.features.length; i++) {
                let destId = completeData.features[i].properties.id
                let t = partialData.destinations[destId]?.time || 0
                let d = partialData.destinations[destId]?.distance || 0
                let f = partialData.destinations[destId]?.fare || 0
                completeData.features[i].properties.time = t
                completeData.features[i].properties.distance = d
                completeData.features[i].properties.fare = f
            }
            mapRef.current.getSource('ward').setData(completeData);
        })
    }

    useEffect(() => {
        fetchNewData(mapClickIdRef.current, modeState, statsState)
    }, [modeState, statsState])

    function renderMaxTimeMenu() {
        if(modeState == 'driving') {
            return <MenuItem value={'max_travel_time'}>Peak Traffic Conditions</MenuItem>
        }
    }

    function renderDrivingStats() {
        if(modeState == 'driving') {
            return (
                <>
                    <div className={styles.cost_container}>
                        <div className={styles.cost_item}>
                            <p>Petrol<br/>Consumption</p>
                            <h3 ref={petrolConRef}></h3>
                        </div>
                        <div className={styles.cost_item}>
                            <p>Diesel<br/>Consumption</p>
                            <h3 ref={dieselConRef}></h3>
                        </div>
                    </div>
                    <div className={styles.cost_container}>
                        <div className={styles.cost_item}>
                            <p>Trip Cost on Petrol (Rs)</p>
                            <h3 ref={petrolCostRef}></h3>
                        </div>
                        <div className={styles.cost_item}>
                            <p>Trip Cost on Diesel (Rs)</p>
                            <h3 ref={dieselCostRef}></h3>
                        </div>
                        <div className={styles.cost_item}>
                            <p>Trip Cost with EV (Rs)</p>
                            <h3 ref={evCostRef}></h3>
                        </div>
                    </div>
                    <div className={styles.cost_container}>
                        <div className={styles.cost_item}>
                            <p>CO2 Emitted<br/>with Petrol use</p>
                            <h3 ref={petrolCo2Ref}></h3>
                        </div>
                        <div className={styles.cost_item}>
                            <p>CO2 Emitted<br/>with Diesel use</p>
                            <h3 ref={dieselCo2Ref}></h3>
                        </div>
                        <div className={styles.cost_item}>
                            <p>CO2 Emitted with EV use</p>
                            <h3 ref={evCo2Ref}></h3>
                        </div>
                    </div>
                </>
            )
        }
        else {
            return (
                <div className={styles.cost_container}>
                    <div className={styles.cost_item}>
                        <p>Trip Cost</p>
                        <h3 ref={transitCostRef}></h3>
                    </div>
                </div>
            )
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

    return (
        <>
            <div ref={mapContainerRef} className="map_container"></div>
            <div className={styles.iuo_title}>
                India Urban Observatory
            </div>
            <div className={styles.controller_container}>
                <h1 className={styles.heading}>Impact of transport modes and traffic on travel time, fuel consumption, cost and carbon emissions</h1>
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
                <FormControl
                    fullWidth
                    style={{
                        'marginTop': '10px',
                        'marginBottom': '10px'
                    }}
                >
                <InputLabel id="select-mode">Mode</InputLabel>
                    <Select
                    labelId="select-mode"
                    id="select-mode-label"
                    value={modeState}
                    label="Mode"
                    onChange={handleModeChange}
                    >
                        <MenuItem value={'driving'}>Driving</MenuItem>
                        <MenuItem value={'transit'}>Public Transit</MenuItem>
                    </Select>
                </FormControl>
                <FormControl
                    fullWidth
                    style={{
                        'marginTop': '10px',
                        'marginBottom': '10px'
                    }}
                >
                <InputLabel id="select-stats">Stats</InputLabel>
                    <Select
                    labelId="select-stats"
                    id="select-stats-label"
                    value={statsState}
                    label="Stats"
                    onChange={handleStatsChange}
                    >
                        <MenuItem value={'average_travel_time'}>Normal Traffic Conditions</MenuItem>
                        {renderMaxTimeMenu()}
                    </Select>
                </FormControl>
                <p className={styles.detail_info}>This visualisation gives an overview of travel time within different wards of Bangalore by driving and public transit.</p>
                <p className={styles.detail_info}>It shows you various time and distance dependant indicators like average speed of the trip, fuel consumption, fuel price for a trip and carbon emissions under normal and peak traffic conditions.</p>
                <p className={styles.detail_info}>Time and distance is computed from one centroid point of a ward to another.</p>
                <p className={styles.detail_info}>Fuel consumption is computed based on a study documented in <a href="http://ijtte.com/uploads/2015-12-22/935be804-3a4a-3e79IJTTE_Vol%205(4)_10.pdf" target="_blank" rel="noreferrer">this paper</a></p>
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
                    {renderDrivingStats()}
                </div>
            </div>
            <div className={styles.legend}>
                {renderLegend()}
            </div>
        </>
    )
}

export default TravelTime;