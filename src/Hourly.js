import React from 'react';
import { percent, round } from './logic.js';
import './Hourly.css';
const Moment = window.moment;

export class Hourly extends React.Component {
   handleHour(data) {
      let i = 10;
      let main = [];
      data.forEach(hour => {
         // skip 0th hour
         if (i === 10) {
            i++;
            return;
         }
         const time = Moment.unix(hour.time).format("MMMM Do h a");
         const temp = round(hour.apparentTemperature);
         const precipProb = percent(hour.precipProbability);
         main.push(
            <div key={i} className="hourly">
               <h5>{time}</h5>
               <h5>{hour.summary}</h5>
               <h5>{temp}°F</h5>
               <h5>Chance of {hour.precipType} {precipProb}%</h5>
               <h5>Wind speed {round(hour.windSpeed)} mph</h5>
            </div>
         )
         i++;
      })
      return main;
   }
   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         return (
            <div className="hourlys">
               {this.handleHour(this.props.weatherData.data)}
            </div>
         )
      }
   }
}