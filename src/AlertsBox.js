import React from 'react';
const Moment = window.moment;

export class AlertsBox extends React.Component {
   render() {
      if (this.props.alertData === '' || typeof this.props.alertData === 'undefined') {
         return (
            <div>
               No warnings or advisories at this time
            </div>
         )
      } else {
         return (
            <div className="alerts">
               <h3>{this.props.alertData[0].title}</h3>
               <p>{this.props.alertData[0].description}</p>
               <h5>EXPIRES {Moment.unix(this.props.alertData[0].expires).format("h:hh a")}</h5>
            </div>
         )
      }
   }
}