import React from 'react';

export class Hourly extends React.Component {
   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         return (
            <div>
               <ul>
                  <li>{this.props.weatherData}</li>
               </ul>
            </div>
         )
      }
   }
}