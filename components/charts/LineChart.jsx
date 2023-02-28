import React from 'react'
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = (props) => {
    const labels = []
    for (var i = 0; i < 198; i++) {
        labels.push((i+1).toString());
    }
    var options = {
        scales: {
            x: {
                title: {
                  display: true,
                  text: 'Ward Number', // add x-axis label
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Speed (Km/Hr)', // add y-axis label
                },
            },
        },
        responsive: true,
        
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Comparison Chart',
          },
          
        },
    };
    var lineData = {
        labels: labels,
        datasets:[
            {
                label: 'Driving',
                data: props.driving,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Transit',
                data: props.transit,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                label: 'Cycling',
                data: props.bicycle,
                borderColor: 'rgb(60, 179, 113)',
                backgroundColor: 'rgba(60, 179, 113, 0.5)',
            }
        ]
    }
  return (
    <div style = {{width: "1080px", margin:"auto"}}>
          <Line options={options} data={lineData}/>;
    </div>
  )
}

export default LineChart