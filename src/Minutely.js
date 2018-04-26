import React from 'react';
import ReactDOM from 'react-dom';
import { percent } from './logic.js';
import './style/Minutely.css';

// chartjs
let Chart = window.Chart;

export class Minutely extends React.Component {
   constructor(props) {
      super(props)

      this.minutelyRef = React.createRef();
   }

   handleSummary() {
      if (typeof this.props.weatherData !== "undefined") {
         this.minutelyRef.current.style.display = "flex";
         return <h3 id="week-summary">{this.props.weatherData.summary}</h3>;
      }
      return;
   }

   render() {
      return (
         <div className="minutely" ref={this.minutelyRef}>
            <h2>Next 60 minutes</h2>
            <div className="minute-summary-box">
               {this.handleSummary()}
            </div>
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

      this.chartContainerRef = React.createRef();
      this.createXArr = this.createXArr.bind(this);
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

   render() {
      return (
         <div className="chart-container" ref={this.chartContainerRef}>
            <canvas id="chart" />
         </div>
      )
   }
}