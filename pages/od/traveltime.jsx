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

import 

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
    const wardDataRef = useRef();
    const wardDrivingRef = useRef();
    const wardDrivingMaxRef = useRef();
    const wardTransitRef = useRef();
    const speedTransitRef = useRef();
    const speedDrivingRef = useRef();
    const speedMaxDrivingRef = useRef();
    const comparisonInfoBoxRef = useRef();

    

    const [modeState, setModeState] = useState('driving');
    const [statsState, setStatsState] = useState('average_travel_time');
    const [wardState, setWardState] = useState('77')
    const [wardStateDestination, setWardStateDestination] = useState("")
    const [tempCyclingChartData, setTempCyclingChartData] = useState([])
    const [tempDrivingChartData, setTempDrivingChartData] = useState([])
    const [tempTransitChartData, setTempTransitChartData] = useState([])
    const [cyclingChartData, setCyclingChartData] = useState([])
    const [drivingChartData, setDrivingChartData] = useState([])
    const [transitChartData, setTransitChartData] = useState([])

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

    useEffect(()=>{
        if (wardDataRef.current!==undefined && wardDrivingRef!==undefined && wardTransitRef!==undefined){
            let d = []
            let c = []
            let t = []
            for (let i=1; i<199; i++){
                c.push(((wardDataRef.current[wardState].destinations[i.toString()]?.distance/1000)/(wardDataRef.current[wardState].destinations[i.toString()]?.time/3600)).toFixed(1))
                d.push(((wardDrivingRef.current[wardState].destinations[i.toString()]?.distance/1000)/(wardDrivingRef.current[wardState].destinations[i.toString()]?.time/3600)).toFixed(1))
                t.push(((wardTransitRef.current[wardState].destinations[i.toString()]?.distance/1000)/(wardTransitRef.current[wardState].destinations[i.toString()]?.time/3600)).toFixed(1))
            }
            setTempDrivingChartData(d)
            setTempCyclingChartData(c)
            setTempTransitChartData(t)
        }
    }, [wardDataRef.current, wardDrivingRef.current, wardTransitRef.current, wardState])

    useEffect(()=>{
        if(tempDrivingChartData.length === 198 && tempCyclingChartData.length === 198 && tempTransitChartData.length === 198){
            setCyclingChartData(tempCyclingChartData)
            setDrivingChartData(tempDrivingChartData)
            setTransitChartData(tempTransitChartData)
        }
    }, [tempCyclingChartData, tempDrivingChartData, tempTransitChartData])

    function handleModeChange(e) {
        console.log('change mode')
        mode.current = e.target.value
        setModeState(e.target.value)
        infoBoxRef.current.style.display = 'none'
        comparisonInfoBoxRef.current.style.display = 'none'
        setWardStateDestination("")
        if(e.target.value == 'transit') {
            stats.current = 'average_travel_time'
            setStatsState('average_travel_time')
        }
    }

    function handleStatsChange(e) {
        console.log('change stats')
        stats.current = e.target.value
        setStatsState(e.target.value)
        setWardStateDestination("")
        infoBoxRef.current.style.display = 'none'
        comparisonInfoBoxRef.current.style.display = 'none'
    }

    function handleWardChange(e) {
        setWardState(e.target.value)
        fromPlace.current = wardNames[e.target.value]
        fromPlaceRef.current.innerHTML = 'From ' + (fromPlace.current) + ' to'
    }

    function handleWardDestinationChange(e){
        setWardStateDestination(e.target.value)
        toPlaceRef.current.innerHTML = wardNames[e.target.value]
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
        let wardDrivingPromise = fetch('/data/driving_data/ward_wise_data_driving.json')
        let wardTransitPromise = fetch('/data/transit_data/ward_wise_data_transit.json')
        let wardPromise = fetch('/data/cycle_data/ward_wise_data.json')
        let wardDrivingMaxPromise = fetch('/data/driving_data/ward_wise_data_driving_max.json')
        map.on('load', () => {
            wardPromise.then(res => res.json()).then(wardData=>{
                wardDataRef.current = wardData
            })
            wardDrivingPromise.then(res=>res.json()).then(wardDrivingData=>{
                wardDrivingRef.current = wardDrivingData
            })
            wardTransitPromise.then(res=>res.json()).then(wardTransitData=>{
                wardTransitRef.current = wardTransitData
            })
            wardDrivingMaxPromise.then(res=>res.json()).then(wardDrivingMaxData=>{
                wardDrivingMaxRef.current = wardDrivingMaxData
            })
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
                                'case',
                                ['==', ['get', 'noroutes'], true], '#696969',
                                [
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
                                ]
                            ],
                            'fill-opacity': 0.8,
                            'fill-outline-color': '#6E91BE'
                        }
                    }, 'road_trunk_primary')
                })
        
                map.on('click', 'ward_layer', e => {
                    if (mode.current==='bicycle'){
                        if (wardsWithoutRoutes.includes(e.features[0].properties.id)===false){
                            let id = e.features[0].properties.id
                            mapClickIdRef.current = id
                            setWardState(e.features[0].properties.id)
                            fromPlace.current = e.features[0].properties.name
                        }
                    }else{
                        let id = e.features[0].properties.id
                        mapClickIdRef.current = id
                        setWardState(e.features[0].properties.id)
                        fromPlace.current = e.features[0].properties.name
                    }
                    

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
                    if (mode.current==='bicycle'){
                        if (wardsWithoutRoutes.includes(e.features[0].properties.id)===false){
                            setWardStateDestination(e.features[0].properties.id)
                            toPlaceRef.current.innerHTML = e.features[0].properties.name 
                        }
                    }else{
                        setWardStateDestination(e.features[0].properties.id)
                        toPlaceRef.current.innerHTML = e.features[0].properties.name
                    }
                    fromPlaceRef.current.innerHTML = 'From ' + (fromPlace.current || initWard.bangalore.ward_name) + ' to'
                })
                     
                map.on('mouseleave', 'ward_layer', function (e) {
                    map.getCanvas().style.cursor = '';
                });
            });
    }, [])

    function handleInfoBoxInfo(){
        let dieselPrice = 95 // Rs / L
        let petrolPrice = 110 // Rs / L
        let petrolCo2Emission = 2347.69813574 // grams CO2 / L
        let dieselCo2Emission = 2689.27276041 // grams CO2 / L
        let electricCo2Emission = 57.6699029126 // grams CO2 / km
        let time, distance, speed, steadyStateFuelConsumptionPetrol, 
        steadyStateFuelConsumptionDiesel, petrolCongestionFactor, dieselCongestionFactor,
        petrolConsumption, dieselConsumption, petrolCo2, diesellCo2, 
        speedTag, petrolCost, dieselCost, evCost, transitCost, petrolConsumptionTag,
        dieselConsumptionTag, petrolCo2Tag, dieselCo2Tag, electricCo2Tag,
        d_dist, n_time
        if(mode.current === 'driving'){
            if(statsState==='average_travel_time'){
                time = (wardDrivingRef.current[wardState].destinations[wardStateDestination]?.time||0) / 3600
                distance = (wardDrivingRef.current[wardState].destinations[wardStateDestination]?.distance||0) / 1000
                speed = distance / time
            } else {
                time = (wardDrivingMaxRef.current[wardState].destinations[wardStateDestination]?.time||0) / 3600
                distance = (wardDrivingMaxRef.current[wardState].destinations[wardStateDestination]?.distance||0) / 1000
                speed = distance / time
            }
            
            // 5000 mm / km of roughness
            steadyStateFuelConsumptionPetrol = 30 + 844.085 / speed + 0.003 * speed ** 2 + 0.001 * 5000
            steadyStateFuelConsumptionDiesel = 35 + 983.503 / speed + 0.002 * speed ** 2 + 0.001 * 5000

            petrolCongestionFactor = 0.0003 * speed ** 2 - 0.0344 * speed + 1.9555
            dieselCongestionFactor = 0.0005 * speed ** 2 - 0.0609 * speed + 2.8175

            petrolConsumption = steadyStateFuelConsumptionPetrol * distance / 1000 // in L
            dieselConsumption = steadyStateFuelConsumptionDiesel * distance / 1000 // in L

            petrolConsumption = petrolConsumption * petrolCongestionFactor
            dieselConsumption = dieselConsumption * dieselCongestionFactor

            petrolCo2 = petrolConsumption * petrolCo2Emission
            diesellCo2 = dieselConsumption * dieselCo2Emission

            speedTag = speed.toFixed(1) + ' kmph'
            // let petrolCost = '<p>Petrol Cost: ₹ ' + (e.features[0].properties.distance / 1000 * 4.35).toFixed(1) + '</p>'
            petrolCost = (petrolConsumption * petrolPrice).toFixed(1)
            dieselCost = (steadyStateFuelConsumptionDiesel * distance / 1000 * dieselPrice).toFixed(1)
            evCost = (distance * 1.17).toFixed(1)

            petrolConsumptionTag = petrolConsumption.toFixed(1) + ' L'
            dieselConsumptionTag = dieselConsumption.toFixed(1) + ' L'
            
            petrolCo2Tag = (petrolCo2 / 1000).toFixed(1) + ' kg'
            dieselCo2Tag = (diesellCo2 / 1000).toFixed(1) + ' kg'
            electricCo2Tag = (electricCo2Emission * distance / 1000).toFixed(1) + ' kg'

            

            // infoBoxRef.current.innerHTML = '<p> From ' + fromPlace.current + ' to</p>' + '<h2>' + e.features[0].properties.name + '</h2>' + '<h3>' + renderTime(time) + '</h3>' + speedTag + petrolCost + dieselCost + evCost + petrolConsumptionTag + dieselConsumptionTag + petrolCo2Tag + dieselCo2Tag + electricCo2Tag
            timeRef.current.innerHTML = renderTime(time)
            distanceRef.current.innerHTML = distance.toFixed(1) + ' km'
            speedTagRef.current.innerHTML = speedTag
            
            petrolCostRef.current.innerHTML = petrolCost
            dieselCostRef.current.innerHTML = dieselCost
            evCostRef.current.innerHTML = evCost
            petrolConRef.current.innerHTML = petrolConsumptionTag
            dieselConRef.current.innerHTML = dieselConsumptionTag
            petrolCo2Ref.current.innerHTML = petrolCo2Tag
            dieselCo2Ref.current.innerHTML = dieselCo2Tag
            evCo2Ref.current.innerHTML = electricCo2Tag
        }else if (mode.current ==='transit'){
            time = (wardTransitRef.current[wardState].destinations[wardStateDestination]?.time||0) / 3600
            distance = (wardTransitRef.current[wardState].destinations[wardStateDestination]?.distance||0) / 1000
            speed = distance / time
            // 5000 mm / km of roughness

            speedTag = speed.toFixed(1) + ' kmph'
            // let petrolCost = '<p>Petrol Cost: ₹ ' + (e.features[0].properties.distance / 1000 * 4.35).toFixed(1) + '</p>'
            
            transitCost = wardTransitRef.current[wardState].destinations[wardStateDestination]?.fare

            // infoBoxRef.current.innerHTML = '<p> From ' + fromPlace.current + ' to</p>' + '<h2>' + e.features[0].properties.name + '</h2>' + '<h3>' + renderTime(time) + '</h3>' + speedTag + petrolCost + dieselCost + evCost + petrolConsumptionTag + dieselConsumptionTag + petrolCo2Tag + dieselCo2Tag + electricCo2Tag
        
            timeRef.current.innerHTML = renderTime(time)
            distanceRef.current.innerHTML = distance.toFixed(1) + ' km'
            speedTagRef.current.innerHTML = speedTag
            
            transitCostRef.current.innerHTML = 'Rs ' + transitCost
            
            let driving_time_peak = (wardDrivingMaxRef.current[wardState].destinations[wardStateDestination]?.time || 0)/3600
            let driving_distance_peak = (wardDrivingMaxRef.current[wardState].destinations[wardStateDestination]?.distance || 0)/1000
            let driving_speed_peak= driving_distance_peak/driving_time_peak
            let speedMaxDrivingTag = driving_speed_peak.toFixed(1) + ' kmph'
            speedMaxDrivingRef.current.innerHTML = speedMaxDrivingTag
            let driving_time = (wardDrivingRef.current[wardState].destinations[wardStateDestination]?.time || 0)/3600
            let driving_distance = (wardDrivingRef.current[wardState].destinations[wardStateDestination]?.distance || 0)/1000
            let driving_speed = driving_distance/driving_time
            let speedDrivingTag = driving_speed.toFixed(1) + ' kmph'
            speedDrivingRef.current.innerHTML = speedDrivingTag
        } else {
            time = (wardDataRef.current[wardState].destinations[wardStateDestination]?.time||0) / 3600
            distance = (wardDataRef.current[wardState].destinations[wardStateDestination]?.distance||0) / 1000
            d_dist = (wardDataRef.current[wardState].destinations[wardStateDestination]?.diff_dist||0) / 1000
            speed = distance / time
            n_time = d_dist / speed
            speedTag = speed.toFixed(1) + ' kmph'
            distanceRef.current.innerHTML = d_dist.toFixed(1) + ' km'
            speedTagRef.current.innerHTML = speedTag
            timeRef.current.innerHTML = renderTime(n_time)

            let transit_time = (wardTransitRef.current[wardState].destinations[wardStateDestination]?.time || 0)/3600
            let transit_distance = (wardTransitRef.current[wardState].destinations[wardStateDestination]?.distance || 0)/1000
            let driving_time = (wardDrivingRef.current[wardState].destinations[wardStateDestination]?.time || 0)/3600
            let driving_distance = (wardDrivingRef.current[wardState].destinations[wardStateDestination]?.distance || 0)/1000
            let transit_speed = transit_distance/transit_time
            let driving_speed = driving_distance/driving_time
            let speedTransitTag = transit_speed.toFixed(1) + ' kmph'
            let speedDrivingTag = driving_speed.toFixed(1) + ' kmph'
            speedTransitRef.current.innerHTML = speedTransitTag
            speedDrivingRef.current.innerHTML = speedDrivingTag
            let driving_time_peak = (wardDrivingMaxRef.current[wardState].destinations[wardStateDestination]?.time || 0)/3600
            let driving_distance_peak = (wardDrivingMaxRef.current[wardState].destinations[wardStateDestination]?.distance || 0)/1000
            let driving_speed_peak= driving_distance_peak/driving_time_peak
            let speedMaxDrivingTag = driving_speed_peak.toFixed(1) + ' kmph'
            speedMaxDrivingRef.current.innerHTML = speedMaxDrivingTag
        }
    }
    function fetchNewData(id, mode, stats) {
        let completeData = dataRef.current

        if(!completeData) {
            return
        }

        console.log(mode, stats)

        fetch(apiEndpointPartialdata + '?id=' + id + '&mode=' + mode + '&stats=' + stats)
        .then(res => res.json())
        .then(partialData => {
            for(let i=0; i<completeData.features.length; i++) {
                let destId = completeData.features[i].properties.id
                let t = partialData.destinations[destId]?.time || 0
                let d = partialData.destinations[destId]?.distance || 0
                let f = partialData.destinations[destId]?.fare || 0
                let c = false
                completeData.features[i].properties.time = t
                completeData.features[i].properties.distance = d
                completeData.features[i].properties.fare = f
                completeData.features[i].properties.noroutes = c
            }
            mapRef.current.getSource('ward').setData(completeData);
        })
    }

    function fetchNewBicycleData(id){
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
            let c = wardsWithoutRoutes.includes(destId.toString())
            completeData.features[i].properties.time = t
            completeData.features[i].properties.distance = d 
            completeData.features[i].properties.diff_dist = dd
            completeData.features[i].properties.diff_time = dt
            completeData.features[i].properties.noroutes = c
        }
        mapRef.current.getSource('ward').setData(completeData)
    }

    useEffect(() => {
        if (modeState !== 'bicycle'){
            fetchNewData(mapClickIdRef.current, modeState, statsState)
            
        } else {
            fetchNewBicycleData(mapClickIdRef.current)
        }
    }, [modeState, statsState])

    useEffect(()=>{
        if (modeState !== 'bicycle'){
            fetchNewData(wardState, modeState, statsState)
        } else {
            fetchNewBicycleData(wardState)
        }
        if (wardDataRef.current!==undefined && wardDrivingRef.current!==undefined && wardDrivingMaxRef.current!==undefined && wardTransitRef!==undefined && wardStateDestination!==""){
            handleInfoBoxInfo()
        }
    }, [wardState])

    useEffect(()=>{
        if (wardDataRef.current!==undefined && wardDrivingRef.current!==undefined && wardDrivingMaxRef.current!==undefined && wardTransitRef!==undefined && wardStateDestination!==""){
            infoBoxRef.current.style.display = 'block'
            handleInfoBoxInfo()
            if (mode.current!=='driving'){
                comparisonInfoBoxRef.current.style.display = 'block'
            }
        }
    }, [wardStateDestination])

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
        else if (modeState == 'transit'){
            return (
                <div className={styles.cost_container}>
                    <div className={styles.cost_item}>
                        <p>Trip Cost</p>
                        <h3 ref={transitCostRef}></h3>
                    </div>
                </div>
            )
        } else {
            return (<></>)
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
            <div className={styles.ward_info_box}>
                <h2>Origin Ward</h2>
                <FormControl 
                    fullWidth
                    style={{
                        'marginTop': '10px',
                        'marginBottom': '10px'
                    }}
                >
                    <Select
                        id="select-ward-origin-label"
                        value={wardState}
                        onChange={handleWardChange}
                        style={{width:"15rem"}}
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                            {Object.entries(wardNames).map(([key, value])=>
                                {
                                    if (modeState === 'bicycle'){
                                        if (wardsWithoutRoutes.includes(key)===false){
                                            return <MenuItem key={key} value={key}>{value}</MenuItem>
                                        }
                                    }else {
                                        return <MenuItem key={key} value={key}>{value}</MenuItem>
                                    }                                
                            })}
                    </Select>
                </FormControl>
            </div>
            <div className={styles.ward_destination_info_box}>
                <h2>Destination Ward</h2>
                <FormControl 
                    fullWidth
                    style={{
                        'marginTop': '10px',
                        'marginBottom': '10px'
                    }}
                >
                    <Select
                        id="select-ward-destination-label"
                        value={wardStateDestination}
                        onChange={handleWardDestinationChange}
                        style={{width:"15rem"}}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                            {Object.entries(wardNames).map(([key, value])=>
                                {
                                    if (modeState === 'bicycle'){
                                        if (wardsWithoutRoutes.includes(key)===false){
                                            return <MenuItem key={key} value={key}>{value}</MenuItem>
                                        }
                                    }else {
                                        return <MenuItem key={key} value={key}>{value}</MenuItem>
                                    }                                
                            })}
                    </Select>
                </FormControl>
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
                        <MenuItem value={'bicycle'}>Cycling</MenuItem>
                    </Select>
                </FormControl>
                {modeState!=='bicycle'?<FormControl
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
                </FormControl>:""}
                <p className={styles.detail_info}>This visualisation gives an overview of travel time within different wards of Bangalore by driving and public transit.</p>
                <p className={styles.detail_info}>It shows you various time and distance dependant indicators like average speed of the trip, fuel consumption, fuel price for a trip and carbon emissions under normal and peak traffic conditions.</p>
                <p className={styles.detail_info}>Time and distance is computed from one centroid point of a ward to another.</p>
                {modeState!=='bicycle'?<p className={styles.detail_info}>Fuel consumption is computed based on a study documented in <a href="http://ijtte.com/uploads/2015-12-22/935be804-3a4a-3e79IJTTE_Vol%205(4)_10.pdf" target="_blank" rel="noreferrer">this paper</a></p>:""}
                <p className={styles.detail_info}>Data on cycle rides in Bangalore taken from <a href="https://data.opencity.in/dataset/bengaluru-cycle-rides-data" target="_blank" rel="noreferrer">here</a></p>
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