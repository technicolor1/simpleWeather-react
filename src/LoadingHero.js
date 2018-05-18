import React from 'react';

export class LoadingHero extends React.Component {
   render() {
      let body = document.querySelector("body");
      if (this.props.isLoading) {
         body.classList.toggle("modalOpen");
         return (
            <div 
               className="loading-hero"
               style={{
                  position: "fixed",
                  display: "flex",
                  zIndex: "5",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  width: "100%",
                  height: "100%",
                  background: "rgb(255,255,255)"
               }}
            >
               <div 
                  className="loading-msg"
                  style={{
                     margin: "auto",
                     color: "black",
                     fontSize: "50px"
                  }}   
               >
                  Loading...
               </div>
            </div>
         )
      }
      body.classList.toggle("modalOpen");
      
      return null;
   }
}