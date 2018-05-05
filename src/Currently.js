import React from 'react';
import { round, weatherIcon, rotateWindBearing, percent, uvIndexColor } from './logic.js';
import './style/Currently.css';

export class Currently extends React.Component {
   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return null;
      } else {
         const {
            icon,
            summary,
            apparentTemperature,
            humidity,
            windSpeed,
            windBearing,
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