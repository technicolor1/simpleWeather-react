import React from 'react';

// Header Component: 
export class Header extends React.Component {
   render() {
      if (typeof this.props.location === undefined || this.props.location === '') {
         return (
            <div>
               <h1>Weather</h1>
            </div>
         )
      } else {
         return (
            <div>
               <h1>Weather for {this.props.location}</h1>
            </div>
         )
      }
   }
}