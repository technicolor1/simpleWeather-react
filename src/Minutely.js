import React from 'react';
import ReactDOM from 'react-dom';

// chartjs
let Chart = window.Chart;

export class Minutely extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            datasets: [{
               label: "Dataset #1",
               backgroundColor: "rgba(255,99,132,0.2)",
               borderColor: "rgba(255,99,132,1)",
               borderWidth: 2,
               hoverBackgroundColor: "rgba(255,99,132,0.4)",
               hoverBorderColor: "rgba(255,99,132,1)",
               data: [65, 59, 20, 81, 56, 55, 40],
            }]
         },
         options: {
            maintainAspectRatio: false,
            scales: {
               yAxes: [{
                  stacked: true,
                  gridLines: {
                     display: true,
                     color: "rgba(255,99,132,0.2)"
                  }
               }],
               xAxes: [{
                  gridLines: {
                     display: false
                  }
               }]
            }
         }
      }
   }

   componentDidMount() {
      Chart.Bar('chart', {
         data: this.state.data
      })
      
   }

   render() {
      return (
         <div className="chart-container">
            <canvas id="chart">
            </canvas>
         </div>
      )
   }
}