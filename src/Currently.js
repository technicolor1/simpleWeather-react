import React from 'react';
import { round, determineRain, weatherIcon, rotateWindBearing, percent, uvIndexColor } from './logic.js';
import './style/Currently.css';
const Moment = window.moment;

export class Currently extends React.Component {
   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return null;
      } else {
         const {
            time,
            icon,
            summary,
            apparentTemperature,
            humidity,
            precipProbability,
            windSpeed,
            windBearing,
            precipType,
            uvIndex
         } = this.props.weatherData;

         return (
            <div className="currently">
               <div id="sum">
                  <h2>{summary}</h2>
               </div>

               <div id="icon">
                  <span>{weatherIcon(icon)}</span>
               </div>

               <div id="temp">
                  <h1>{round(apparentTemperature)}°F</h1>
               </div>

               <div id="other">
                  <span>UV Index <span style={uvIndexColor(uvIndex)}>{uvIndex}</span></span>
                  <span>{rotateWindBearing(windBearing)} {round(windSpeed)} mph</span>
               </div>

               <div id="other2">
                  <span><i className="wi wi-humidity" title="humidity"/> {percent(humidity)}%</span>                  
               </div>
            </div>
         )
      }
   }
}