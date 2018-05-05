import React from 'react';
import { percent, round, determineRain, weatherIcon, betterPrecipIntensity, uvIndexColor, rotateWindBearing } from './logic.js';
import './style/Weekly.css';
const Moment = window.moment;

export class Weekly extends React.Component {
   constructor(props) {
      super(props)

      this.weeklyDiv = React.createRef();
      this.handleDivClick = this.handleDivClick.bind(this);
   }

   handleDivClick(event) {
      // hide extras
      if (event.currentTarget.children[1].style.display === "block") {
         event.currentTarget.children[1].style.display = "none";
         return;
      }
      // expand extras
      event.currentTarget.children[1].style.display = "block";
   }

   handleDaily(data) {
      let counter = 0;
      let id = 0;
      let main = [];

      data.forEach(day => {
         const {
            time,
            icon,
            summary,
            apparentTemperatureHigh,
            apparentTemperatureLow,
            precipProbability,
            precipType,
            precipIntensityMax,
            humidity,
            sunsetTime,
            uvIndex,
            windBearing,
            windSpeed,
            pressure
         } = day;
         
         let timeFormatted = Moment.unix(time).format("ddd");

         // 0th day is today
         if (counter === 0) {
            timeFormatted = "Today";
         }

         // 1st day is tomorrow
         if (counter === 1) {
            timeFormatted = "Tomorrow";
         }

         id++;
         counter++;
         main.push(
            <div key={`Day-${id}`} className="daily-wrapper weatherCells" onClick={this.handleDivClick}>
               <div className="daily">
                  <div id="icon">
                     <span>{weatherIcon(icon)}</span>
                  </div>

                  <div id="time">
                     <h5>{timeFormatted}</h5>
                  </div>

                  <div id="summary">
                     <p>{summary}</p>
                  </div>

                  <div id="other">
                     <h5>{round(apparentTemperatureHigh)}° · {round(apparentTemperatureLow)}°</h5>
                     {determineRain(precipProbability, precipType)}
                     {betterPrecipIntensity(precipIntensityMax)}
                  </div>
               </div>
               <div style={{ display: "none" }} className="extras-wrapper">
                  <hr />
                  <div className="extras">
                     <div className="extras-child" id="humidity">
                        <i className="wi wi-humidity" title="humidity" />
                        <p>{percent(humidity)}%</p>
                     </div>

                     <div className="extras-child" id="set">
                        <i className="wi wi-sunset" />
                        <p>{Moment.unix(sunsetTime).format("h:mm a")}</p>
                     </div>

                     <div className="extras-child" id="uv">
                        <p>UV Index</p>
                        <p><span style={uvIndexColor(uvIndex)}>{uvIndex}</span></p>
                     </div>

                     <div className="extras-child" id="wind">
                        {rotateWindBearing(windBearing)}
                        <p>{round(windSpeed)} mph</p>
                     </div>

                     <div className="extras-child" id="pressure">
                        <i className="wi wi-barometer" />
                        <p>{pressure}</p>
                     </div>
                  </div>
               </div>
            </div>
         )
      })
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
            <div className="dailies">
               <h2>Weekly</h2>
               <div className="main-summary week-summary-box">
                  <p id="week-summary">{weatherData.summary}</p>
               </div>             
               <div className="scrollables" ref={this.weeklyDiv}>
                  {this.handleDaily(weatherData.data)}
               </div>
            </div>
         )
      }
   }
}