import React from 'react';
import ReactDOM from 'react-dom';
import { percent } from './logic.js';
import './style/Minutely.css';

// chartjs
let Chart = window.Chart;

export class Minutely extends React.Component {
   constructor(props) {
      super(props)

   }

   render() {
      const {
         weatherData
      } = this.props;

      if (typeof weatherData === "undefined") {
         return null;
      }
      return (
         <div className="minutely">
            <div className="minutely-header">
               <h2>Next 60 minutes</h2>
            </div>
            <div className="minute-summary-box">
               <p>{weatherData.summary}</p>
            </div>
            <MinutelyChart weatherData={weatherData} />
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

      this.createXArr = this.createXArr.bind(this);
      this.lineChart = this.lineChart.bind(this);
   }

   lineChart(nextProps) {
      // destroy existing chart
      if (this.state.lineChart != null) {
         this.state.lineChart.destroy();
      }

      let minutes = this.props.weatherData.data;
      if (typeof nextProps !== "undefined") {
         minutes = nextProps.weatherData.data;
      }

      const precipProbArr = minutes.map(minute => percent(minute.precipProbability));
      precipProbArr.splice(0, 1);

      let lineChart = new Chart('chart', {
         type: 'line',
         data: {
            labels: this.createXArr().splice(1),
            datasets: [{
               backgroundColor: "rgba(111, 159, 216, 0.5)",
               borderColor: "rgb(62, 99, 146)",
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
                  gridLines: {
                     display: false
                  },
                  ticks: {
                     autoSkip: false
                  }
               }]
            }
         }
      })
      this.setState({
         lineChart: lineChart
      })
   }

   componentDidMount() {
      // render chart once container exists in dom
      this.lineChart();
   }
   
   componentWillReceiveProps(nextProps) {
      // catch react 'just checking in'
      if (typeof nextProps.weatherData === "undefined") {
         console.log("no data, react checking in");
         return;
      }
      // re-render chart with new data
      this.lineChart(nextProps);
   }

   // x-axis array for line chart
   createXArr() {
      let Arr = [];
      let counter = 0;

      for (let i = 0; i <= 60; i++) {
         if (i === 0) {
            continue;
         }

         if (i === 1) {
            Arr[i] = '1min';
            continue;
         }

         if (i % 10 === 0) {
            counter += 10;
            Arr[i] = counter + "min";
            continue;
         }

         Arr[i] = "";
      }

      return Arr;
   }

   render() {
      return (
         <div className="chart-container">
            <canvas id="chart" />
         </div>
      )
   }
}