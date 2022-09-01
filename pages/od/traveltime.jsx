import * as maplibre from 'maplibre-gl/dist/maplibre-gl';
import { useEffect, useRef } from 'react';

function TravelTime() {

    const mapContainerRef = useRef();
    const mapRef = useRef();
    const apiEndpoint = 'http://127.0.0.1:8000/get_od_data_json'

    useEffect(() => {
        let map = new maplibre.Map({
            container: mapContainerRef.current,
            style: '/styles/mute.json',
            zoom: 10,
            center: [77.592476, 12.976711]
        })
        mapRef.current = map;

        map.on('load', () => {
            map.addSource('ward', {
                type: 'geojson',
                data: apiEndpoint
            })

            map.addLayer({
                id: 'ward_layer',
                type: 'fill',
                source: 'ward',
                layout: {},
                paint: {
                    'fill-color': [
                        'interpolate', ['linear'],
                        ['number', ['get', 'mean_travel_sec']],
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
                        4000, '#000125'
                    ],
                    'fill-opacity': 0.8,
                    'fill-outline-color': '#6E91BE'
                }
            }, 'road_trunk_primary')
        })

        map.on('click', 'ward_layer', e => {
            let id = e.features[0].properties.id
            fetch(apiEndpoint + '?id=' + id)
                .then(res => res.json())
                .then(data => {
                    map.getSource('ward').setData(data);
                })
            console.log(id)
        });

        map.on('mouseenter', 'ward_layer', function () {
            map.getCanvas().style.cursor = 'pointer';
        });
             
        map.on('mouseleave', 'ward_layer', function () {
        map.getCanvas().style.cursor = '';
        });
    }, [])

    return (
        <div ref={mapContainerRef} className="map_container"></div>
    )
}

export default TravelTime;