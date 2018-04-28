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
      if (event.currentTarget.children[1].style.display === "flex") {
         event.currentTarget.children[1].style.display = "none";
         return;
      }
      // expand extras
      event.currentTarget.children[1].style.display = "flex";
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

         id++;
         main.push(
         <div key={id} className="daily-wrapper" onClick={ this.handleDivClick }>
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
                  <h5>{highTemp}° · {lowTemp}°</h5>
                  <h5>{determineRain(day.precipProbability, day.precipType)}</h5>
                  {betterPrecipIntensity(day.precipIntensityMax)}
               </div>
            </div>
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
                  <p><span>{rotateWindBearing(day.windBearing)}</span></p>
                  <p>{round(day.windSpeed)} mph</p>
               </div>

               <div className="extras-child" id="pressure">
                  <p><span><i className="wi wi-barometer" /></span></p>
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