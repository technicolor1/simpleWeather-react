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
         let time = Moment.unix(day.time).format("ddd");

         // 0th day is today
         if (counter === 0) {
            time = "Today";
         }

         // 1st day is tomorrow
         if (counter === 1) {
            time = "Tomorrow";
         }

         id++;
         counter++;
         main.push(
            <div key={`Day-${id}`} className="daily-wrapper" onClick={this.handleDivClick}>
               {/* first el is the main div */}
               {/* second el is the extras div (hidden) */}
               <div className="daily weather-step">
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
                     <h5>{round(day.apparentTemperatureHigh)}° · {round(day.apparentTemperatureLow)}°</h5>
                     {determineRain(day.precipProbability, day.precipType)}
                     {betterPrecipIntensity(day.precipIntensityMax)}
                  </div>
               </div>
               <div style={{ display: "none" }} className="extras-wrapper">
                  <hr />
                  <div className="extras">
                     <div className="extras-child" id="humidity">
                        <i className="wi wi-humidity" title="humidity" />
                        <p>{percent(day.humidity)}%</p>
                     </div>

                     <div className="extras-child" id="set">
                        <i className="wi wi-sunset" />
                        <p>{Moment.unix(day.sunsetTime).format("h:mm a")}</p>
                     </div>

                     <div className="extras-child" id="uv">
                        <p>UV Index</p>
                        <p><span style={uvIndexColor(day.uvIndex)}>{day.uvIndex}</span></p>
                     </div>

                     <div className="extras-child" id="wind">
                        {rotateWindBearing(day.windBearing)}
                        <p>{round(day.windSpeed)} mph</p>
                     </div>

                     <div className="extras-child" id="pressure">
                        <i className="wi wi-barometer" />
                        <p>{day.pressure}</p>
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
            <div className="dailies detail-wrapper">
               <h2>Weekly</h2>
               <div className="week-summary-box">
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