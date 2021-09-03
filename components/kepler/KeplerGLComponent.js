import { useEffect } from 'react';
import { connect } from 'react-redux';
import KeplerGl from 'kepler.gl';
import {addDataToMap, addNotification} from 'kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

function KeplerGlComponent(props) {
	const dispatch = props.dispatch

	useEffect(() => {
		const {data, readOnly} = props;

		if(data != undefined) {
            dispatch(
                addDataToMap({
					...data,
					options: {
						centerMap: false,
						readOnly: readOnly === 'true' ? true : false
					},
				})
            )
        }
	}, [props.data])

  	return (
    	<div>
      		<main style={{position: 'absolute', width: '100%', height: '100%'}}>
				<AutoSizer>
					{({height, width}) => (
						<KeplerGl
						mapboxApiAccessToken={"pk.eyJ1IjoiZHN1LW1vaHVhIiwiYSI6ImNrcnZwZmNpdTA4dzgybnJ4Z2Q0cjdnOGcifQ.4RHMCa916LMiIEuMSmIwkQ"}
						id="map"
						width={width}
						height={height}
						theme="light"
						appName="Urban Observatory"
						mapStyles={[
							{
								id: 'basic_mapbox',
								label: 'Basic',
								url: 'mapbox://styles/dsu-mohua/ckt48bdp30tmi17odxeew2sq8',
								icon: `https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/-122.3391,37.7922,9.19,0,0/400x300?access_token=pk.eyJ1IjoiZHN1LW1vaHVhIiwiYSI6ImNrcnZwZmNpdTA4dzgybnJ4Z2Q0cjdnOGcifQ.4RHMCa916LMiIEuMSmIwkQ&logo=false&attribution=false`,
								layerGroups: [
									{
										slug: 'label',
										filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
										defaultVisibility: true
									},
									{
										// adding this will keep the 3d building option
										slug: '3d building',
										filter: () => false,
										defaultVisibility: false
									}
								]
							}
						]}						  
						/>
					)}
				</AutoSizer>
      		</main>
    	</div>
  )
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(KeplerGlComponent);
