import React from 'react';
import { round, determineRain, weatherIcon, rotateWindBearing } from './logic.js';
import './Currently.css';
const Moment = window.moment;

export class Currently extends React.Component {
   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return <div></div>
      } else {
         const time = Moment.unix(this.props.weatherData.time).format("MMMM Do h:mm a");
         const summary = this.props.weatherData.summary;
         const apparentTemp = this.props.weatherData.apparentTemperature;
         const humidity = this.props.weatherData.humidity;
         const precipProbability = this.props.weatherData.precipProbability;
         const windSpeed = this.props.weatherData.windSpeed;
         const precipType = this.props.weatherData.precipType;
         const UV = this.props.weatherData.uvIndex;

         return (
            <div className="currently">
               <div id="as-of">
                  <h5>As of {time}</h5>
               </div>

               <div id="sum">
                  <h2>{summary}</h2>
               </div>

               <div id="icon">
                  {weatherIcon(this.props.weatherData.icon)}
               </div>

               <div id="temp">
                  <h1>{round(apparentTemp)}°F</h1>
               </div>

               <div id="precip">
                  {determineRain(precipProbability, precipType)}
                  <span>{rotateWindBearing(this.props.weatherData.windBearing)} {round(windSpeed)} mph</span>
               </div>

               <div id="uv">
                  <h3>UV Index {UV}</h3>
               </div>
            </div>
         )
      }
   }
}