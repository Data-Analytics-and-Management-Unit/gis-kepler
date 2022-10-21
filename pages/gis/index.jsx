import React, { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import Map from '../../components/gis_layers/Map';
import Sidebar from '../../components/gis_layers/Sidebar.jsx';

function Gis() {

	const [checked, setChecked] = useState([]);
	const [checkedBase, setcheckedBase] = useState([]);
	const [baseMapLayers, setBaseMapLayers] = useState([]);
	const [sidebarClickState, setSidebarClickState] = useState(undefined);
	const mapStyle = '/styles/mute.json';

	const fetchLayersData = async () => {
		const res = await fetch('/data/generic_layers/layers.json')
		return res.json()
	}

	const fetchStyleData = async () => {
		const res = await fetch(mapStyle)
		return res.json()
	}

	function handleCheck(checked) {
		setChecked(checked);
	};

	function handleCheckBase(checkedBase) {
		setcheckedBase(checkedBase);
	};

	const { data, status } = useQuery('layers', fetchLayersData);
	const styleResponse = useQuery('style', fetchStyleData);

	useEffect(() => {
		if(status == 'success') {
			console.log(data)
		}
	}, [data])

	useEffect(() => {
		
	}, [styleResponse])

	useEffect(() => {
		fetch(mapStyle)
			.then(res => res.json())
			.then(style => {
				let baseChecked = []
				style.layers.forEach(l => {
					baseChecked.push(l.id)
				})
				setBaseMapLayers(style)
				setcheckedBase(baseChecked)
			})
	}, [])

	if(data) {
		return (
			<div style={{
				width: '100%',
				height: '100%'
			}}>
			<Map
				checked={checked}
				checkedBase = {checkedBase}
				style={mapStyle}
				baseMapLayers={baseMapLayers}
				sidebarClickState={sidebarClickState}
				layersData={data}
			/>
			<Sidebar
				handleCheck={handleCheck}
				checked={checked}
				handleCheckBase={handleCheckBase}
				checkedBase={checkedBase}
				clickCallback={setSidebarClickState}
				layersData={data}
			/>
			</div>
		)
	} else {
		return (
			<h1>Loading...</h1>
		)
	}

	
}

export default Gis;