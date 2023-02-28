import React from 'react'
import { Bar } from 'react-chartjs-2';
import zoomPlugin from "chartjs-plugin-zoom";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

const StackedBarChart = (props) => {
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
                stacked: true
            },
            y: {
                title: {
                    display: true,
                    text: 'Speed (Km/Hr)', // add y-axis label
                },
                stacked: true
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
          zoom: {
            zoom: {
                wheel: {
                  enabled: true // SET SCROOL ZOOM TO TRUE
                },
                mode: "x",
                speed: 100
            },
            pan: {
                enabled: true,
                mode: "x",
                speed: 100
            }
          }
        },
    };
    var barData = {
        labels: labels,
        datasets:[
            {
                label: 'Driving',
                data: props.driving,
                backgroundColor: 'rgba(255, 99, 132)',
                stack: 'Stack 0'
            },
            {
                label: 'Transit',
                data: props.transit,
                backgroundColor: 'rgba(53, 162, 235)',
                stack: 'Stack 1'
            },
            {
                label: 'Cycling',
                data: props.bicycle,
                backgroundColor: 'rgba(60, 179, 113)',
                stack: 'Stack 2'
            }
        ]
    }
  return (
    <div style = {{width: "1080px", margin:"auto"}}>
          <Bar options={options} data={barData}/>;
    </div>
  )
}

export default StackedBarChart