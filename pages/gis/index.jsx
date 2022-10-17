import React, { useState } from 'react';
import { useEffect } from 'react';

import Map from '../../components/gis_layers/Map';
import Sidebar from '../../components/gis_layers/Sidebar.jsx';

function Gis() {

	const [checked, setChecked] = useState([]);
	const [checkedBase, setcheckedBase] = useState([]);
	const [baseMapLayers, setBaseMapLayers] = useState([]);
	const mapStyle = '/styles/mute.json'

	function handleCheck(checked) {
		setChecked(checked);
	};

	function handleCheckBase(checkedBase) {
		setcheckedBase(checkedBase);
	};

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
		/>
		<Sidebar
			handleCheck={handleCheck}
			checked={checked}
			handleCheckBase={handleCheckBase}
			checkedBase={checkedBase}
			
		/>
		</div>
	)
}

export default Gis;