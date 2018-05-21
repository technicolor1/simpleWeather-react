import React from 'react';
import './style/LoadingHero.css';

export class LoadingHero extends React.Component {
   render() {
      let body = document.querySelector("body");
      if (this.props.isLoading) {
         body.classList.toggle("modalOpen");
         return (
            <div className="loading-hero">
               <div className="loading-msg">
                  Loading...
               </div>
            </div>
         )
      }
      body.classList.toggle("modalOpen");
      
      return null;
   }
}