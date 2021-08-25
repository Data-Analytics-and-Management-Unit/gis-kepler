import { useEffect, useState } from 'react';
import {processGeojson, processCsvData} from 'kepler.gl/processors';

function Process(props) {

	useEffect(() => {
		let urls = [
            '/data/population/census_pop.csv'
        ]

        console.log(urls)

        let fileType = 'csv'

        let mapDataPromise = Promise.all(
            urls.map(url => fetch(url).then(res => {
                if(fileType === 'json') {
                    return res.json()
                } else {
                    return res.text()
                }
            }))
        )
        mapDataPromise.then(res => {
            console.log(processCsvData(res[0]))
        })
	}, [])

  	return (
    	<div>
			hi
    	</div>
  )
}

export default Process;
