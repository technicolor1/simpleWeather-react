import React from 'react';
import { percent,round, determineRain } from './logic.js';
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
         // skip 0th day
         if (id === 0) {
            id++;
            return;
         }
         const time = Moment.unix(day.time).format("dddd");
         const sunrise = Moment.unix(day.sunriseTime).format("h:mm a");
         const sunset = Moment.unix(day.sunsetTime).format("h:mm a");
         const highTemp = round(day.apparentTemperatureHigh);
         const lowTemp = round(day.apparentTemperatureLow);
         main.push(
         <div key={id} className="daily">
            <h5>{time}</h5>
            <h5>{highTemp}°F / {lowTemp}°F</h5>
            <h5>{determineRain(day.precipProbability, day.precipType)}</h5>
            <h5>Humidity {percent(day.humidity)}%</h5>
            <h5>{sunrise} / {sunset}</h5>
         </div>
         )
         id++;
      })
      return main;
   }

   componentDidUpdate() {
      const weeklyComp = this.weeklyDiv.current;
      console.log(weeklyComp);
      if (weeklyComp !== null) {
         if (weeklyComp.scrollLeft !== 0) {
            weeklyComp.scrollLeft = 0;
         }
      }
   }

   render() {
      if (typeof this.props.weatherData === 'undefined') {
         return <div></div>
      } else {
         return (
            <div>
               <h2>Week at a Glance</h2>
               <div className="scrollables" ref={this.weeklyDiv}>
                  {this.handleDaily(this.props.weatherData.data)}
               </div>
            </div>
         )
      }
   }
}