import React from 'react';
import { percent, round } from './logic.js';
const Moment = window.moment;

export class Currently extends React.Component {
   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         const time = Moment.unix(this.props.weatherData.time).format("MMMM Do h:mm a");
         const summary = this.props.weatherData.summary;
         const apparentTemp = this.props.weatherData.apparentTemperature;
         const humidity = this.props.weatherData.humidity;
         const precipProbability = this.props.weatherData.precipProbability;
         const windSpeed = this.props.weatherData.windSpeed;

         // TODO: if chance of rain is zero, conditionally invoke a different h2
         return (
            <div className="currently">
                  <h2>As of {time}...</h2>
                  <h2>{summary}</h2>
                  <h2>Feels like {round(apparentTemp)}°F</h2>
                  <h2>Humidity {percent(humidity)}%</h2>
                  <h2>Chance of rain {percent(precipProbability)}%</h2>
                  <h2>Wind speed {round(windSpeed)} mph</h2>
            </div>
         )
      }
   }
}