import React from 'react';
const Moment = window.moment;

export class Time extends React.Component {
   render() {
      if (typeof this.props.time === "undefined") {
         return null;
      } else {
         const { time } = this.props.time;

         return (
            <div className="currentTime">
               <h5>As of {Moment.unix(time).format("MMMM Do h:mm a")}</h5>
            </div>
         )
      }
   }
}