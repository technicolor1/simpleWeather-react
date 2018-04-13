import React from 'react';

function percent(val) {
   return (val * 100).toFixed(0);
}

function round(val) {
   return Math.round(val);
}

function determineRain(precipProb, precipType) {
   if (precipProb <= 0.10) {
      return;
   }

   return `Chance of ${precipType} ${percent(precipProb)}%`
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
         return <i className="wi wi-cloud"></i>

      case 'cloudy':
         return <i className="wi wi-cloudy"></i>
         
      default:
         return;
   }
}

export { percent, round, determineRain, weatherIcon };