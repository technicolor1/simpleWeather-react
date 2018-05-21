import React from 'react';
import './style/index.css';
import { Header } from './Header.js';
import { keys } from './config/config.js';
import { Currently } from './Currently.js';
import { Weekly } from './Weekly.js';
import { Hourly } from './Hourly.js';
import { SearchBox } from './SearchBox.js';
import { AlertsBox } from './AlertsBox.js';
import { Minutely } from './Minutely.js';
import { Time } from './Time.js';
import { LoadingHero } from './LoadingHero.js';
// weathersample for testing
import { weatherSample } from './weatherSample.js';

const $ = window.jQuery;

export class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         location: '',
         weatherData: '',
         recentGoogledata: null,
         isLoading: true
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
   
      let darksky = `https://api.darksky.net/forecast/${keys.opendarksky}/${lat},${long}?exclude=flags&callback=?`;
      // fetching, is loading
      this.setState({
         isLoading: true
      })

      $.getJSON(darksky, (data) => {
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
      // check fresh in localstorage
      // not loading if the app is fresh
      if (this.state.recentGoogledata === null) {
         this.setState({
            isLoading: false
         })
      }
      this.loadLocalStorage();
   }

   saveLocalStorage(googledata) {
      // cache fetched data, stringified
      localStorage.setItem("weatherData", JSON.stringify(this.state.weatherData));
      localStorage.setItem("recentgoogledata", JSON.stringify(googledata));
   }
     
   loadLocalStorage() {
      // if cached data present, use it instead of placeholder
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
      console.log("refresh clicked at App level", this.state.recentGoogledata);
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

            {/* TODO: some locations do not have minutely data,
            acknowledge user that there is none */}
            <Minutely weatherData={this.state.weatherData.minutely} />

            <Hourly weatherData={this.state.weatherData.hourly} />
            
            <Weekly weatherData={this.state.weatherData.daily} />

            <LoadingHero isLoading={this.state.isLoading} />

         </div>
      )
   }
}
