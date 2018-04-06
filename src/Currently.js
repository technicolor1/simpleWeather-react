import React from 'react';
const Moment = window.moment;

export class Currently extends React.Component {
   percent(val) {
      return (val * 100).toFixed(0);
   }
   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         const time = Moment.unix(this.props.weatherData.time).format("MMMM Do h:mm a");
         const summary = this.props.weatherData.summary;
         const apparentTemp = this.props.weatherData.apparentTemperature;
         const humidity = this.props.weatherData.humidity;
         const precipProbability = this.props.weatherData.precipProbability;
         const nearStorm = this.props.weatherData.nearestStormDistance;
         const windSpeed = this.props.weatherData.windSpeed;

         return (
            <div className="currently">
                  <h2>As of {time}...</h2>
                  <h2>{summary}</h2>
                  <h2>Feels like {Math.round(apparentTemp)}°F</h2>
                  <h2>Humidity {this.percent(humidity)}%</h2>
                  <h2>Chance of rain {this.percent(precipProbability)}%</h2>
                  <h2>Nearest storm {nearStorm} miles<sup>*</sup></h2>
                  <h2>Wind speed {Math.round(windSpeed)} mph</h2>
            </div>
         )
      }
   }
}