import React from 'react';
import { percent,round, determineRain } from './logic.js';
import './Weekly.css';
const Moment = window.moment;

export class Weekly extends React.Component {
   constructor(props) {
      super(props)

      this.weeklyDiv = React.createRef();
   }
   handleDaily(data) {
      let id = 0;
      let main = [];
      data.forEach(day => {
         // skip 0th day
         if (id === 0) {
            id++;
            return;
         }
         const time = Moment.unix(day.time).format("ddd");
         const sunrise = Moment.unix(day.sunriseTime).format("h:mm a");
         const sunset = Moment.unix(day.sunsetTime).format("h:mm a");
         const highTemp = round(day.apparentTemperatureHigh);
         const lowTemp = round(day.apparentTemperatureLow);
         main.push(
         <div key={id} className="daily">
            <div id="time">
               <h5>{time}</h5>
            </div>

            <div id="summary">
               <h5>{day.summary}</h5>
            </div>

            <div id="hl_temp">
               <h5>{highTemp}°F / {lowTemp}°F</h5>               
            </div>

            <div id="precip">
               <h5>{determineRain(day.precipProbability, day.precipType)}</h5>            
            </div>

            <div className="extras">
               <div id="humidity">
                  <h5><i className="wi wi-humidity" title="humidity"/> {percent(day.humidity)}%</h5>            
               </div>

               <div id="rise-set">
                  <h5><i className="wi wi-sunrise"></i>{sunrise} <i className="wi wi-sunset"></i>{sunset}</h5>            
               </div>            
            </div>
         </div>
         )
         id++;
      })
      return main;
   }

   componentDidUpdate() {
      // the user will not need to scroll to start 
      const weeklyComp = this.weeklyDiv.current;
      if (weeklyComp !== null) {
         if (weeklyComp.scrollLeft !== 0) {
            weeklyComp.scrollLeft = 0;
         }
      }
   }

   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return <div></div>
      } else {
         return (
            <div className="dailies">
               <h2>Week at a Glance</h2>
               <h3 id="week-summary">{this.props.weatherData.summary}</h3>
               <div className="scrollables" ref={this.weeklyDiv}>
                  {this.handleDaily(this.props.weatherData.data)}
               </div>
            </div>
         )
      }
   }
}