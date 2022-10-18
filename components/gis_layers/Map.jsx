import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from '../../styles/Map.module.scss';
import Layer from './layer';
import data from "./data.json";
// import layers from "../mapStyle.json"

export default function Map(props) {
	//Initialize state

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [lng] = useState(80);
	const [lat] = useState(24);
	const [zoom] = useState(4);
	var layerList = [];


	//Generating list of layer objects
	function traverse(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].type === "parent") {
				traverse(arr[i].children);
			}
			else {
				layerList.push(arr[i]);
			}
		}
	}

  	traverse(data.data);

	useEffect(() => {
		if(props.sidebarClickState) {
			console.log(map.current.getSource(props.sidebarClickState.value))
		}
	}, [props.sidebarClickState])

	useEffect(() => {
		// console.log(props.checked)
		// console.log(map.current)
		if (map.current) {

			console.log('in map current')

			// console.log(props.checked)


			// map.current.on('load', () => {

				// console.log(props.checked)

				let baseLayers = props.baseMapLayers.layers

				// layerConcat = layerList.concat()

				
				
				// Toggle Fuctionality for custom data
				for (var i = 0; i < layerList.length; i++) {
					if(map.current.getLayer(layerList[i].value)) {
						if (props.checked.includes(layerList[i].value)) {
							map.current.setLayoutProperty(layerList[i].value, 'visibility', 'visible');
						}
						else {
							map.current.setLayoutProperty(layerList[i].value, 'visibility', 'none');
						};
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

		let m = new maplibregl.Map({
			container: mapContainer.current,
			style: props.style,
			center: [lng, lat],
			zoom: zoom
		});
		m.addControl(new maplibregl.NavigationControl(), 'top-right');

		map.current = m;

		//Generating layers

		// console.log(layerList)

		m.on('load', () => {
			for (var i = 0; i < layerList.length; i++) {
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
				}, 'waterway_tunnel')
				// console.log(layerList[i].id)

				m.on('click', layerList[i].id, (e) => {
					new maplibregl.Popup()
						.setLngLat(e.lngLat)
						.setHTML(`<p> Name: ${e.features[0].properties.Name_1}</p><p>No: ${e.features[0].properties.No}</p>`)
						.addTo(m);
				});
			}
		})

		

		
		//   Layer(map.current, layerList[i].id, layerList[i].type, layerList[i].source, "", {}, 0, layerList[i].paint, layerList[i].layout, layerList[i].filter);


		// for (var i = 0; i < layers.layers.length; i++) {
		//   props.checkedBase.push(layers.layers[i].id)
		// }
	}, [props.checked, props.checkedBase]);
  	//Set baseMap layers checked by default

	return (
		<div className={styles.map_container}>
			<div ref={mapContainer} className={styles.map} />
		</div>
	)
}