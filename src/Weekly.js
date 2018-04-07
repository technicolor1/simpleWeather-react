import React from 'react';
import './Weekly.css';
const Moment = window.moment;

export class Weekly extends React.Component {
   handleDaily(data) {
      let id = 0;
      let main = [];
      data.forEach(day => {
         const sunrise = Moment.unix(day.sunriseTime).format("h:mm a");
         const sunset = Moment.unix(day.sunsetTime).format("h:mm a");
         const highTemp = Math.round(day.apparentTemperatureHigh);
         const lowTemp = Math.round(day.apparentTemperatureLow);
         main.push(
         <div key={id} className="daily">
            <h5>{highTemp}°F / {lowTemp}°F</h5>
            <h5>Sunrise {sunrise}</h5>
            <h5>Sunset {sunset}</h5>
         </div>
         )
         id++;
      })
      return main;
   }

   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         return (
            <div className="dailys">
               {this.handleDaily(this.props.weatherData.data)}
            </div>
         )
      }
   }
}