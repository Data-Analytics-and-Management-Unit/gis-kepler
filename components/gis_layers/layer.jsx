import maplibregl from 'maplibre-gl';

function Layer(Map, id, type, data, sourceLayer, metadata, minzoom, paint, layout, filter) {

  Map.on('load', () => {

    Map.addLayer({
      'id': id,
      'type': type,
      'source': data,
      'source-layer': sourceLayer,
      'metadata': metadata,
      'minzoom': minzoom,


      'paint': paint,
      'layout': layout,
      'filter': filter


    }, 'waterway_tunnel');

    console.log(id)


    // Map.on('click', id, (e) => {
      
    //   new maplibregl.Popup()
    //     .setLngLat(e.lngLat)
    //     .setHTML(`<p> Name: ${e.features[0].properties.Name_1}</p><p>No: ${e.features[0].properties.No}</p>`)
    //     .addTo(Map);
    // });
    
  });
}

export default Layer;