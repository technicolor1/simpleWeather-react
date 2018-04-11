import React from 'react';
import { percent, round, determineRain } from './logic.js';
import './Hourly.css';
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
               <h5>{time}</h5>
               <h5>{hour.summary}</h5>
               <h5>{temp}°F</h5>
               <h5>{determineRain(hour.precipProbability, hour.precipType)}</h5>
               <h5>Wind speed {round(hour.windSpeed)} mph</h5>
            </div>
         )
         i++;
         counter++;
      }
      return main;
   }
   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         return (
            <div className="hourlies">
               <h2>By the Hour</h2>
               <div className="scrollables">
                  {this.handleHour(this.props.weatherData.data)}
               </div>
            </div>
         )
      }
   }
}