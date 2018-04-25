import React from 'react';
import { percent, round, determineRain, weatherIcon, betterPrecipIntensity, uvIndexColor, rotateWindBearing } from './logic.js';
import './Weekly.css';
const Moment = window.moment;

export class Weekly extends React.Component {
   constructor(props) {
      super(props)

      this.weeklyDiv = React.createRef();
   }
   handleDaily(data) {
      let id = 0;
      let main = [];
      data.forEach(day => {
         const time = Moment.unix(day.time).format("ddd");
         const sunrise = Moment.unix(day.sunriseTime).format("h:mm a");
         const sunset = Moment.unix(day.sunsetTime).format("h:mm a");
         const highTemp = round(day.apparentTemperatureHigh);
         const lowTemp = round(day.apparentTemperatureLow);

         // skip 0th day
         if (id === 0) {
            id++;
            return;
         }
         main.push(
            <div key={id} className="daily">
               <div id="icon">
                  <span>{weatherIcon(day.icon)}</span>
               </div>

               <div id="time">
                  <h5>{time}</h5>
               </div>

               <div id="summary">
                  <p>{day.summary}</p>
               </div>

               <div id="other">
                  <h5>{highTemp}° · {lowTemp}°</h5>
                  <h5>{determineRain(day.precipProbability, day.precipType)}</h5>
                  {betterPrecipIntensity(day.precipIntensityMax)}
               </div>
               
               <div className="extras">
                  <div className="extras-child" id="humidity">
                     <i className="wi wi-humidity" title="humidity" /> 
                     <p>{percent(day.humidity)}%</p>
                  </div>

                  <div className="extras-child" id="set">
                     <i className="wi wi-sunset" />
                     <p>{sunset}</p>
                  </div>

                  <div className="extras-child" id="uv">
                     <p>UV Index</p>
                     <p><span style={ uvIndexColor(day.uvIndex) }>{day.uvIndex}</span></p>
                  </div>

                  <div className="extras-child" id="wind">
                     <p><span>{rotateWindBearing(day.windBearing)}</span></p>
                     <p>{round(day.windSpeed)} mph</p>
                  </div>
               </div>
            </div>
         )
         id++;
      })
      return main;
   }

   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return <div></div>
      } else {
         return (
            <div className="dailies">
               <h2>Weekly</h2>
               <div className="week-summary-box">
                  <h3 id="week-summary">{this.props.weatherData.summary}</h3>
               </div>
               <div className="scrollables" ref={this.weeklyDiv}>
                  {this.handleDaily(this.props.weatherData.data)}
               </div>
            </div>
         )
      }
   }
}