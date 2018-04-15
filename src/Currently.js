import React from 'react';
import { percent, round, determineRain, weatherIcon } from './logic.js';
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

         return (
            <div className="currently">
               <h2>As of {time}...</h2>
               <h2>{summary}</h2>
               <div className="icon">
                  {weatherIcon(this.props.weatherData.icon)}
               </div>
               <h2>{round(apparentTemp)}°F · <i className="wi wi-humidity" title="humidity"></i> {percent(humidity)}%</h2>
               <h2>{determineRain(precipProbability, precipType)}</h2>
               <h2>Wind speed {round(windSpeed)} mph</h2>
            </div>
         )
      }
   }
}