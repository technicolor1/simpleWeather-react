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
// weathersample for testing
import { weatherSample } from './weatherSample.js';

const $ = window.jQuery;

export class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         location: '',
         weatherData: ''
      }

      this.fetchWeather = this.fetchWeather.bind(this);
   }

   fetchWeather(googledata) {
      const {
         location,
         lat,
         long
      } = googledata;

      let darksky = `https://api.darksky.net/forecast/${keys.opendarksky}/${lat},${long}?exclude=flags&callback=?`;

      $.getJSON(darksky, (data) => {
      })
         .done(data => {
            console.log("processing", data);

            // cache fetched data, stringified
            localStorage.setItem("weatherData", JSON.stringify(data));
            localStorage.setItem("location", location);

            this.setState({
               location: location,
               weatherData: data
            })
         })
         .fail((error) => {
            console.log(error);
         })
   }
   
   componentDidMount() {
      window.onload = () => {
         console.log("Onload ran")
         // load sampledata
         // testing
         this.setState({
            weatherData: weatherSample,
            location: 'Test'
         })
      }
   }
   
   loadLocalStorage() {
      // if cached data present, use it instead of placeholder
      if (localStorage.getItem("weatherData") !== null) {
         this.setState({
            weatherData: JSON.parse(localStorage.getItem("weatherData")),
            location: localStorage.getItem("location")
         })
         console.log(this.state.weatherData);
         return;
      }
   }

   render() {
      return (
         <div className="main">
            
            <Header location={this.state.location} />

            <SearchBox fetchLocation={this.fetchLocation} fetchWeather={this.fetchWeather}/>            

            <Time time={this.state.weatherData.currently} />

            <AlertsBox alertData={this.state.weatherData.alerts} />

            <Currently weatherData={this.state.weatherData.currently} />

            {/* TODO: some locations do not have minutely data,
            acknowledge user that there is none */}
            <Minutely weatherData={this.state.weatherData.minutely} />

            <Hourly weatherData={this.state.weatherData.hourly} />
            
            <Weekly weatherData={this.state.weatherData.daily} />

         </div>
      )
   }
}
