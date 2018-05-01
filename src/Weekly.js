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
      // hide hr
      if (event.currentTarget.children[2].style.display === "flex") {
         event.currentTarget.children[2].style.display = "none";
         event.currentTarget.children[1].style.display = "none";
         return;
      }
      // expand extras
      // expand hr
      event.currentTarget.children[2].style.display = "flex";
      event.currentTarget.children[1].style.display = "flex";
   }

   handleDaily(data) {
      let counter = 0;
      let id = 0;
      let main = [];

      data.forEach(day => {
         let time = Moment.unix(day.time).format("ddd");
         const sunset = Moment.unix(day.sunsetTime).format("h:mm a");

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
               <div className="daily">
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
                     <h5>{determineRain(day.precipProbability, day.precipType)}</h5>
                     {betterPrecipIntensity(day.precipIntensityMax)}
                  </div>
               </div>
               <hr style={{ display: "none" }} />
               <div style={{ display: "none" }} className="extras">
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
         )
      })
      return main;
   }

   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return null;
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