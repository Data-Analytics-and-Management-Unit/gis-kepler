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
