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

      this.fetchLocation = this.fetchLocation.bind(this);
      this.fetchWeather = this.fetchWeather.bind(this);
      this.validateGoogle = this.validateGoogle.bind(this);
   }

   fetchLocation(uri) {
      let google = `https://maps.googleapis.com/maps/api/geocode/${uri}&key=${keys.google}`;
      console.log(google);

      fetch(google)
         .then(response => {
            if (response.ok) {
               return response.json();
            }
         })
         .then(data => {
            console.log(data);
            this.validateGoogle(data);
         })
   }

   
   // validate data from fetched google,
   validateGoogle(data) {
      // results must be a city or zipcode
      let validObj = {
         locality: ["locality", "political"],
         zip: ["postal_code"]
      }
      
      let found = null;
      
      if (data.status === "ZERO_RESULTS") {
         console.log("Location can't be found");
         return;
      }
      
      for (let i = 0; i < data.results.length; i++) {
         if ((data.results[i].types).includes(validObj.locality[0]) && (data.results[i].types).includes(validObj.locality[1])) {
            found = data.results[i];
            break;
            
         } else if ((data.results[i].types).includes(validObj.zip[0])) {
            found = data.results[i];
            break;
            
         }
      }
      
      if (found !== null) {
         this.fetchWeather(found.geometry.location.lat, found.geometry.location.lng, found.formatted_address);
      } else {
         console.log("Doesn't match validObj (locality or zip)");
         return;
      }
   }
   
   fetchWeather(lat, long, location) {
      let darksky = `https://api.darksky.net/forecast/${keys.opendarksky}/${lat},${long}?exclude=flags&callback=?`;

      $.getJSON(darksky, (data) => {
         console.log("obtained");
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

         // this.loadLocalStorage();
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

            <SearchBox fetchLocation={this.fetchLocation} />            

            <Time time={this.state.weatherData.currently} />

            <AlertsBox alertData={this.state.weatherData.alerts} />

            <Currently weatherData={this.state.weatherData.currently} />

            <Minutely weatherData={this.state.weatherData.minutely} />

            <Hourly weatherData={this.state.weatherData.hourly} />
            
            <Weekly weatherData={this.state.weatherData.daily} />

         </div>
      )
   }
}
