import React from 'react';

function percent(val) {
   val = Math.round(val * 10) / 10;
   return val * 100;
}

function percentForMinutely(val) {
   return (val * 100).toFixed(0);
}

function round(val) {
   return Math.round(val);
}

function determineRain(precipProb, precipType) {
   if (precipProb <= 0.10) {
      return;
   }

   switch (precipType) {
      case "rain":
         return <h5><span><i className="wi wi-raindrop" /> {percent(precipProb)}%</span></h5>;

      case "snow":
         return <h5><span><i className="wi wi-snowflake-cold" /> {percent(precipProb)}%</span></h5>;

      default:
         return <h5><span><i className="wi wi-raindrop" /> {percent(precipProb)}%</span></h5>;
   }
}

function weatherIcon(icon) {
   switch (icon) {
      case 'clear-day':
         return <i className="wi wi-day-sunny" />

      case 'clear-night':
         return <i className="wi wi-night-clear" />

      case 'rain':
         return <i className="wi wi-rain" />

      case 'partly-cloudy-night':
         return <i className="wi wi-night-alt-cloudy" />

      case 'partly-cloudy-day':
         return <i className="wi wi-day-cloudy" />

      case 'cloudy':
         return <i className="wi wi-cloudy" />

      case 'wind':
         return <i className="wi wi-strong-wind" />

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

function uvIndexColor(index) {
   if (index <= 2) {
      return {
         backgroundColor: "green",
         color: "whitesmoke"
      }
   } if (index <= 5) {
      return {
         backgroundColor: "yellow"
      }
   } else if (index <= 7) {
      return {
         backgroundColor: "orange"
      }
   } else if (index <= 10) {
      return {
         backgroundColor: "red",
         color: "whitesmoke"
      }
   } else {
      return {
         backgroundColor: "purple",
         color: "whitesmoke"
      }
   }
}

function betterPrecipIntensity(val) {
   if (val < 0.1) {
      return;
   }

   return <h5>{val.toPrecision(2)}</h5>
}

export {
   percent,
   percentForMinutely,
   round,
   determineRain,
   weatherIcon,
   rotateWindBearing,
   uvIndexColor,
   betterPrecipIntensity
};
