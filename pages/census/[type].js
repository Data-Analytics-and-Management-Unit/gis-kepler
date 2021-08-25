import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import Head from 'next/head';
import KeplerGl from 'kepler.gl';
import {addDataToMap, addNotification} from 'kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import {processGeojson} from 'kepler.gl/processors';

import KeplerGLComponent from '../../components/kepler/KeplerGLComponent';

import Config from './config.json';

function Home(props) {
	const router = useRouter()
  	const { type, readOnly } = router.query
	const dispatch = props.dispatch
	const [mapState, setMapState] = useState(undefined)

	useEffect(() => {
		console.log(type)
		if(type !== undefined && Config[type] !== undefined) {
			let urls = Config[type].urls

			console.log(urls)

			let mapDataPromise = Promise.all(
				urls.map(url => fetch(url).then(res => res.json()))
			)
			mapDataPromise.then(res => {
				console.log(res[0])
				setMapState({
					datasets: res[0].datasets,
					config: res[0].config
				})
			})
		}
		
		
	}, [type])

  	return (
    	<div>
			<Head>
        		<title>Census Visualisation</title>
        		<meta name="description" content="Visualising Census data" />
        		<link rel="icon" href="/favicon.ico" />
      		</Head>

      		<KeplerGLComponent data={mapState} readOnly={readOnly}/>

			<footer>
				
			</footer>
    	</div>
  )
}

export default Home;
