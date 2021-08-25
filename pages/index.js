import { useEffect } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import Head from 'next/head';
import Image from 'next/image';
import KeplerGl from 'kepler.gl';
import {addDataToMap, addNotification} from 'kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {processGeojson} from 'kepler.gl/processors';

function Home(props) {
	console.log(props)
	const dispatch = props.dispatch

	/* useEffect(() => {
		const {params: {id} = {}} = props;
		console.log(id)
		let urls = [
			'/data/nightlight/nightlight.config.json',
			'/data/nightlight/1992_simplified.geojson',
			'/data/nightlight/2001_simplified.geojson',
			'/data/nightlight/2011_simplified.geojson',
			'/data/nightlight/2013_simplified.geojson',
		]

		let mapDataPromise = Promise.all(
			urls.map(url => fetch(url).then(res => res.json()))
		)
		mapDataPromise.then(res => {
			dispatch(
				addDataToMap({
					datasets: [
						{
							info: {
								label: 'Nightlight 1992',
								id: 'rbabqklri'
							},
							data: processGeojson(res[1])
						},
						{
							info: {
								label: 'Nightlight 2001',
								id: '89jvi3jii'
							},
							data: processGeojson(res[2])
						},
						{
							info: {
								label: 'Nightlight 2011',
								id: 'aqlp7ocnh'
							},
							data: processGeojson(res[3])
						},
						{
							info: {
								label: 'Nightlight 2013',
								id: 'zj81uixvur'
							},
							data: processGeojson(res[4])
						},
					],
					options: {
						centerMap: true,
						readOnly: false
					},
					config: res[0]
				})
			)
		})
		
	}, []) */

  	return (
    	<div>
			<Head>
        		<title>Census Visualisation</title>
        		<meta name="description" content="Visualising Census data" />
        		<link rel="icon" href="/favicon.ico" />
      		</Head>

      		<main style={{position: 'absolute', width: '100%', height: '100%'}}>
				<AutoSizer>
					{({height, width}) => (
						<KeplerGl
						mapboxApiAccessToken={"pk.eyJ1IjoiZHN1LW1vaHVhIiwiYSI6ImNrcnZwZmNpdTA4dzgybnJ4Z2Q0cjdnOGcifQ.4RHMCa916LMiIEuMSmIwkQ"}
						id="raw_map"
						width={width}
						height={height}
						/>
					)}
				</AutoSizer>
          
      		</main>

			<footer>
				
			</footer>
    	</div>
  )
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(Home);
