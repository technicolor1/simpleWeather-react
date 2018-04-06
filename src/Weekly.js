import React from 'react';
const Moment = window.moment;

export class Weekly extends React.Component {
   handleDaily() {

   }

   render() {
      if (this.props.locatedAndData === false) {
         return <div></div>
      } else {
         const dailyArr = handleDaily(this.props.weatherData);
         return (
            <div>
               <div className="daily"></div>
               <div className="daily"></div>
               <div className="daily"></div>
               <div className="daily"></div>
               <div className="daily"></div>
               <div className="daily"></div>
               <div className="daily"></div>
            </div>
         )
      }
   }
}