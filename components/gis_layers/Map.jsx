import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '../../styles/Map.module.scss';

export default function Map(props) {
	//Initialize state

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng] = useState(80);
	const [lat] = useState(24);
	const [zoom] = useState(4);
	const layerListRef = useRef([]);

	//Generating list of layer objects
	function traverse(arr, l) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].type === "parent") {
				traverse(arr[i].children, l);
			}
			else {
				l.push(arr[i]);
			}
		}
	}

	useEffect(() => {
		let l = []
		console.log(props.layersData)
		traverse(props.layersData.data, l);
		layerListRef.current = l
	}, [props.layersData])

	useEffect(() => {
		if(props.sidebarClickState) {
			console.log(map.current.getSource(props.sidebarClickState.value))
		}
	}, [props.sidebarClickState])

	useEffect(() => {
		// console.log(props.checked)
		// console.log(map.current)
		if (map.current && map.current.isStyleLoaded()) {

			console.log('in map current')

			// console.log(props.checked)


			// map.current.on('load', () => {

				// console.log(props.checked)

				let baseLayers = props.baseMapLayers.layers

				// layerConcat = layerList.concat()

				let layerList = layerListRef.current;

				console.log(props.checked, layerList)
				
				// Toggle Fuctionality for custom data
				for (var i = 0; i < layerList.length; i++) {
					if(map.current.getLayer(layerList[i].value)) {
						if (props.checked.includes(layerList[i].value)) {
							map.current.setLayoutProperty(layerList[i].value, 'visibility', 'visible');
						}
						else {
							map.current.setLayoutProperty(layerList[i].value, 'visibility', 'none');
						};
					} else {
						console.log('No layer with id ' + layerList[i].value)
					}
				}
				

				//Toggle functionality for basemap data
				for (var i = 0; i < baseLayers.length; i++) {
					// props.checkedBase.push(baseLayers[i].id)
					if (props.checkedBase.includes(baseLayers[i].id)) {
						map.current.setLayoutProperty(baseLayers[i].id, 'visibility', 'visible');
					}
					else {
						map.current.setLayoutProperty(baseLayers[i].id, 'visibility', 'none');
					};
				}
			// });
			return;
		} //stops map from intializing more than once

		

		

		
		//   Layer(map.current, layerList[i].id, layerList[i].type, layerList[i].source, "", {}, 0, layerList[i].paint, layerList[i].layout, layerList[i].filter);


		// for (var i = 0; i < layers.layers.length; i++) {
		//   props.checkedBase.push(layers.layers[i].id)
		// }
	}, [props.checked, props.checkedBase]);
  	//Set baseMap layers checked by default

	useEffect(() => {
		let m = new maplibregl.Map({
			container: mapContainer.current,
			style: props.style,
			center: [lng, lat],
			zoom: zoom
		});
		m.addControl(new maplibregl.NavigationControl(), 'top-right');
		map.current = m;

		m.on('load', () => {
			let layerList = layerListRef.current;
			for (var i = 0; i < layerList.length; i++) {
				let beforeId = 'waterway_tunnel'
				if(layerList[i].type == 'line') {
					beforeId = 'road_label'
				}

				m.addLayer({
					'id': layerList[i].id,
					'type': layerList[i].type,
					'source': layerList[i].source,
					'source-layer': '',
					'metadata': {},
					'minzoom': 0,
					'paint': layerList[i].paint,
					'layout': layerList[i].layout,
					'filter': layerList[i].filter
				}, beforeId)
				// console.log(layerList[i].id)

				m.on('click', layerList[i].id, (e) => {
					new maplibregl.Popup()
						.setLngLat(e.lngLat)
						.setHTML(`<p> Name: ${e.features[0].properties.Name_1}</p><p>No: ${e.features[0].properties.No}</p>`)
						.addTo(m);
				});
			}
		})
	}, [layerListRef.current])

	return (
		<div className={styles.map_container}>
			<div ref={mapContainer} className={styles.map} />
		</div>
	)
}