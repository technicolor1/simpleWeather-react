import React from 'react';
import { round, weatherIcon } from './logic.js';
import './style/Hourly.css';
const Moment = window.moment;

export class Hourly extends React.Component {
   handleHour(data) {
      let main = [];
      for (let i = 0; i < data.length; i++) {
         const timeFormatted = Moment.unix(data[i].time).format("h a");
         main.push(
            <div key={`Hour-0${i}`} className="hourly-wrapper weatherCells">
            <div id="icon">
               <span>{weatherIcon(data[i].icon)}</span>
            </div>

            <div id="time">
               <h5>{timeFormatted}</h5>
               <p>{data[i].summary}</p>
            </div>

            <div id="other">
               <h5>{round(data[i].apparentTemperature)}°</h5>
            </div>
         </div>
         )

         if (timeFormatted === "12 am") {
            main.splice(main.length-1, 0,
               <div 
                  className="nextday-wrapper weatherCells"
                  key={`newDay-0${i}`}
               >
                  {(Moment.unix(data[i].time).format("MMMM Do"))}
               </div>
            )
         }
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
            <div className="hourlies">
               <h2>By the Hour</h2>
               <div className="main-summary hourly-summary-box">
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