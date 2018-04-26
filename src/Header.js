import React from 'react';
import './style/Header.css';

// Header Component: 
export class Header extends React.Component {
   render() {
      if (typeof this.props.location === undefined || this.props.location === '') {
         return (
            <div className="header">
               <h1 id="header">Weather</h1>
            </div>
         )
      } else {
         return (
            <div className="header">
               <h1 id="header">{this.props.location}</h1>
            </div>
         )
      }
   }
}