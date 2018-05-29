import React from 'react';
import './style/index.css';
import { Header } from './Header.js';
import { Currently } from './Currently.js';
import { Weekly } from './Weekly.js';
import { Hourly } from './Hourly.js';
import { SearchBox } from './SearchBox.js';
import { AlertsBox } from './AlertsBox.js';
import { Minutely } from './Minutely.js';
import { Time } from './Time.js';
import { LoadingHero } from './LoadingHero.js';

import { weatherSample } from './weatherSample.js';

const $ = window.jQuery;

export class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         location: '',
         weatherData: '',
         recentGoogledata: null,
         isLoading: false
      }

      this.fetchWeather = this.fetchWeather.bind(this);
      this.handleRefresh = this.handleRefresh.bind(this);
   }

   fetchWeather(googledata) {
      const {
         location,
         lat,
         long
      } = googledata;
   
      let darksky = `https://api.darksky.net/forecast/${process.env.REACT_APP_OPENDARKSKY_API_KEY}/${lat},${long}?exclude=flags&callback=?`;
      // fetching, is loading
      this.setState({
         isLoading: true
      })

      $.getJSON(darksky, data => {
      })
         .done(data => {
            console.log("processing", data);

            this.setState({
               location: location,
               weatherData: data,
               recentGoogledata: googledata,
               isLoading: false
            })

            this.saveLocalStorage(googledata);
         })
         .fail((error) => {
            console.log(error);
         })
   }
   
   componentDidMount() {
      this.loadWeatherSample();
      // this.loadLocalStorage();
   }

   // 
   // testing purposes!
   // 
   loadWeatherSample() {
      this.setState({
         location: "Test 123",
         weatherData: weatherSample
      })
   }

   saveLocalStorage(googledata) {
      // cache fetched data, stringified
      localStorage.setItem("weatherData", JSON.stringify(this.state.weatherData));
      localStorage.setItem("recentgoogledata", JSON.stringify(googledata));
   }
     
   loadLocalStorage() {
      // use cached data
      if (localStorage.getItem("weatherData") !== null) {
         this.setState({
            weatherData: JSON.parse(localStorage.getItem("weatherData")),
            location: (JSON.parse(localStorage.getItem("recentgoogledata"))).location,
            recentGoogledata: JSON.parse(localStorage.getItem("recentgoogledata")),
            isLoading: false
         })
         return;
      }
   }

   handleRefresh() {
      if (this.state.recentGoogledata === null) { return; }
      this.fetchWeather(this.state.recentGoogledata);
   }

   render() {
      return (
         <div className="main">
        
            <Header location={this.state.location} />

            <SearchBox 
               fetchLocation={this.fetchLocation} 
               fetchWeather={this.fetchWeather}
               onRefreshClicked={this.handleRefresh}
            />
            
            <Time time={this.state.weatherData.currently} />

            <AlertsBox alertData={this.state.weatherData.alerts} />

            <Currently weatherData={this.state.weatherData.currently} />

            <Minutely weatherData={this.state.weatherData.minutely} />
            
            <Hourly weatherData={this.state.weatherData.hourly} />

            <Weekly weatherData={this.state.weatherData.daily} />            

            <LoadingHero isLoading={this.state.isLoading} />

         </div>
      )
   }
}
