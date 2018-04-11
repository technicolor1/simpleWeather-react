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

export { percent, round, determineRain };