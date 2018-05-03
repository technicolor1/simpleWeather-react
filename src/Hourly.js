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
         
         // end at 12th hr
         if (counter === 13) {
            break;
         }

         let time = Moment.unix(hour.time).format("h a");
         
         // once 12am is reached, indicate that it is the next day
         if (time === "12 am") {
            time = Moment.unix(hour.time).format("MMMM Do");
         }

         main.push(
            <div key={`Hour-${i}`} className="hourly weather-step">
               <div id="icon">
                  <span>{weatherIcon(hour.icon)}</span>
               </div>

               <div id="time">
                  <h5>{time}</h5>
                  <p>{hour.summary}</p>
               </div>

               <div id="other">
                  <h5>{round(hour.apparentTemperature)}°</h5>
                  {determineRain(hour.precipProbability, hour.precipType)} 
               </div>
            </div>
         )
         i++;
         counter++;
      }
      return main;
   }
   render() {
      const {
         weatherData
      } = this.props;
      
      if (typeof weatherData === 'undefined') {
         return null;
      } else {
         return (
            <div className="hourlies detail-wrapper">
               <h2>By the Hour</h2>
               <div className="hourly-summary-box">
                  <p id="day-summary">{weatherData.summary}</p>
               </div>
               <div className="scrollables">
                  {this.handleHour(weatherData.data)}
               </div>
            </div>
         )
      }
   }
}