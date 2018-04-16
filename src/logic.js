import React from 'react';

function percent(val) {
   return (val * 100).toFixed(0);
}

function round(val) {
   return Math.round(val);
}

function determineRain(precipProb, precipType) {
   if (precipProb <= 0.10) {
      return <span></span>;
   }

   switch (precipType) {
      case "rain":
         return <span><i className="wi wi-raindrop" /> {percent(precipProb)}%</span>;

      case "snow":
         return <span><i className="wi wi-snowflake-cold" /> {percent(precipProb)}%</span>;
   
      default:
         return <span><i className="wi wi-raindrop" /> {percent(precipProb)}%</span>;         
   }

   // return `${precipType} ${percent(precipProb)}%`
}

function weatherIcon(icon) {
   switch (icon) {
      case 'clear-day':
         return <i className="wi wi-day-sunny"></i>

      case 'clear-night':
         return <i className="wi wi-night-clear"></i>

      case 'rain':
         return <i className="wi wi-rain"></i>
      
      case 'partly-cloudy-day':
         return <i className="wi wi-day-cloudy"></i>

      case 'cloudy':
         return <i className="wi wi-cloudy"></i>

      case 'wind':
         return <i className="wi wi-strong-wind"></i>
         
      default:
         return;
   }
}

function rotateWindBearing(bearing) {
   let rotate = {
      transform: `rotate(${bearing}deg)`
   };

   return (
      <i style={rotate} className="wi wi-wind-direction" />
   )
}

export { percent, round, determineRain, weatherIcon, rotateWindBearing };