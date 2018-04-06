import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Header } from './Header.js';
import { keys } from './config/config.js';
import { Currently } from './Currently.js';
import { Weekly } from './Weekly.js';
import { Hourly } from './Hourly.js';

// TODO: validate searchBoxInput
class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         locatedAndData: false,
         searchBoxInput: '',
         location: '',
         coords: {
            latitude: '',
            longitude: ''
         },
         weatherData: '',
      }

      this.handleChange = this.handleChange.bind(this);
      this.searchLocate = this.searchLocate.bind(this);
   }

   handleChange(event) {
      this.setState({
         searchBoxInput: event.target.value
      })
   }

   searchLocate() {
      let value = this.state.searchBoxInput;
      console.log(value);
      let google = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${keys.google}`;

      fetch(google)
         .then(response => {
            if (response.ok) {
               return response.json();
            }
         })
         .then(data => {
            console.log(data);

            this.setState({
               location: data.results[0].formatted_address,
               coords: { 
                  latitude: data.results[0].geometry.location.lat,
                  longitude: data.results[0].geometry.location.lng
               }
            })
            this.fetchWeather();
         })

   }

   fetchWeather() {
      let lat = this.state.coords.latitude;
      let long = this.state.coords.longitude;
      console.log(lat, long);
      let darksky = `https://api.darksky.net/forecast/${keys.opendarksky}/${lat},${long}?exclude=flags,alerts,minutely`;

      fetch(darksky)
         .then(response => {
            if (response.ok) {
               return response.json();
            }
         })
         .then(data => {
            console.log(data);
            this.setState({
               weatherData: data,
               locatedAndData: true
            })
         })
   }
   
   render() {
      return (
         <div className="main">
            <Header location={this.state.location} />

            <div className="controls">
               <button name="locater">
                  <i className="fas fa-location-arrow"></i>
               </button>
               <input onChange={this.handleChange} id="pac-input" className="controls" type="text" placeholder="Search Box" autoFocus="autofocus" />
               <button name="submit-location" onClick={this.searchLocate}><i className="fas fa-chevron-right"></i></button>
            </div>

            {/* weatherData = data > currently */}
            <Currently locatedAndData={this.state.locatedAndData} weatherData={this.state.weatherData.currently} />
            {/* weatherData = data > daily > array */ }
            <Weekly locatedAndData={this.state.locatedAndData} weatherData={this.state.weatherData.daily} />
            {/* weatherData = data > hourly > array  */}
            {/* <Hourly locatedAndData={this.state.locatedAndData} weatherData={this.state.weatherData} /> */}
         </div>
      )
   }
}

ReactDOM.render(
   <App />,
   document.querySelector("#root")
);
