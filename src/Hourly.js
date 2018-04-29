import React from 'react';
import { round, determineRain, weatherIcon } from './logic.js';
import './style/Hourly.css';
const Moment = window.moment;

export class Hourly extends React.Component {
   handleHour(data) {
      let i = 10;
      let counter = 0;
      let main = [];
      for (let hour of data) {
         // skip 0th hour
         if (counter === 0) {
            counter++;
            continue;
         }
         // end at 25th hr
         if (counter === 25) {
            break;
         }
         const time = Moment.unix(hour.time).format("MMMM Do h a");
         const temp = round(hour.apparentTemperature);
         main.push(
            <div key={i} className="hourly">
               <div id="icon">
                  <span>{weatherIcon(hour.icon)}</span>
               </div>

               <div id="time">
                  <h5>{time}</h5>
                  <h5>{hour.summary}</h5>
               </div>

               <div id="other">
                  <h5>{temp}°</h5>
                  <h5>{determineRain(hour.precipProbability, hour.precipType)}</h5>   
               </div>
            </div>
         )
         i++;
         counter++;
      }
      return main;
   }
   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return null;
      } else {
         return (
            <div className="hourlies">
               <h2>By the Hour</h2>
               <div className="hourly-summary-box">
                  <h3 id="day-summary">{this.props.weatherData.summary}</h3>
               </div>
               <div className="scrollables">
                  {this.handleHour(this.props.weatherData.data)}
               </div>
            </div>
         )
      }
   }
}