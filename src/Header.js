import React from 'react';

// Header Component: 
export class Header extends React.Component {
   render() {
      const {
         location
      } = this.props;

      if (location === undefined) {
         return (
            <div className="header">
               <h1>Weather</h1>
            </div>
         )
      } else {
         return (
            <div className="header">
               <h1>{location}</h1>
            </div>
         )
      }
   }
}