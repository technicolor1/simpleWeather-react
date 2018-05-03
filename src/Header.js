import React from 'react';
import './style/Header.css';

// Header Component: 
export class Header extends React.Component {
   render() {
      const {
         location
      } = this.props;

      if (location === undefined) {
         return (
            <div className="header">
               <h1 id="header">Weather</h1>
            </div>
         )
      } else {
         return (
            <div className="header">
               <h1 id="header">{location}</h1>
            </div>
         )
      }
   }
}