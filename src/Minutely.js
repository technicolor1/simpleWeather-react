import React from 'react';
import ReactDOM from 'react-dom';
import { percent } from './logic.js';

// chartjs
let Chart = window.Chart;

export class Minutely extends React.Component {
   constructor(props) {
      super(props)

   }
   
   render() {
      return (
         <div className="minutely">
            <MinutelyChart weatherData={this.props.weatherData} />
         </div>
      )
   }
}

class MinutelyChart extends React.Component {
   constructor(props) {
      super(props)
      
      this.state = {
         lineChart: null
      }
   }
   
   componentWillReceiveProps(nextProps) {
      // catch react 'just checking in'
      if (typeof nextProps.weatherData === "undefined") {
         console.log("no data, react checking in");
         return;
      }
   
      if (this.state.lineChart != null) {
         this.state.lineChart.destroy();
      }
      
      const minutes = nextProps.weatherData.data;
   
      const precipProbArr = minutes.map(minute => percent(minute.precipProbability));
      precipProbArr.splice(0, 1);
   
      let lineChart = new Chart('chart', {
         type: 'line',
         data: {
            labels: [...Array(60 + 1).keys()].slice(1),
            datasets: [{
               backgroundColor: "rgb(62, 99, 146)",               
               data: precipProbArr
            }]
         },
         options: {
            maintainAspectRatio: false,
            tooltips: {
               enabled: false
            },
            legend: {
               display: false
            },
            elements: {
               point: {
                  radius: 0
               }
            },
            scales: {
               yAxes: [{
                  scaleLabel: {
                     display: true,
                     labelString: "Chance"
                  },   
                  gridLines: {
                     display: true,
                     color: "rgba(0, 0, 0, 0.3)"
                  },
                  ticks: {
                     min: 0,
                     max: 100
                  }
               }],
               xAxes: [{
                  scaleLabel: {
                     display: true,
                     labelString: "mins"
                  },
                  gridLines: {
                     display: false
                  },
                  ticks: {
                     min: 1,
                     max: 60,
                     autoSkip: true,
                     autoSkipPadding: 100
                  }
               }]
            }
         }
      })
      this.setState({
         lineChart: lineChart
      })
   }

   render() {
      return (
         <div className="chart-container" style={{ width: "50vw", height: "35vh"}}>
            <canvas id="chart" />
         </div>
      )
   }
}