import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.css';
import { Header } from './Header.js';
import { keys } from './config/config.js';
import { Currently } from './Currently.js';
import { Weekly } from './Weekly.js';
import { Hourly } from './Hourly.js';
import { SearchBox } from './SearchBox.js';
import { AlertsBox } from './AlertsBox.js';
import { Minutely } from './Minutely.js';
import { weatherSample } from './weatherSample.js';

const jquery = window.jQuery;

class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         searchBoxInput: '',
         location: '',
         weatherData: ''
      }

      this.handleChange = this.handleChange.bind(this);
      this.searchLocate = this.searchLocate.bind(this);
      this.handleGeo = this.handleGeo.bind(this);
   }

   handleChange(event) {
      this.setState({
         searchBoxInput: event.target.value
      })
   }

   searchLocate(val) {
      if (val === "") {
         console.log("Searchbox can't be empty");
         return;
      }
      let google = `https://maps.googleapis.com/maps/api/geocode/json?address=${val}&key=${keys.google}`;

      fetch(google)
         .then(response => {
            if (response.ok) {
               return response.json();
            }
         })
         .then(data => {
            this.validateGoogle(data);
         })

   }

   // validate data from fetched google,
   // output is the valid place or null
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
      // TODO: friendlier alert
      } else {
         console.log("Try a different query");
         return;
      }
   }

   fetchWeather(lat, long, location) {
      let proxy = "https://cors-anywhere.herokuapp.com/";
      let darksky = `https://api.darksky.net/forecast/${keys.opendarksky}/${lat},${long}?exclude=flags&callback=?`;

      jquery.getJSON(darksky, (data) => {
         console.log("retrieving");
      })
         .done(data => {
            console.log(data);
            this.setState({
               location: location,
               weatherData: data
            })
         })
         .fail((error) => {
            console.log(error);
         })
   }

   handleGeo() {
      let App = this;
      function success(pos) {
         let google = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${keys.google}`;
         fetch(google)
            .then(response => {
               if (response.ok) {
                  return response.json();
               }
            })
            .then(data => {
               console.log(data);
               App.validateGoogle(data);
            })
      }

      function fail(error) {
         console.log(error);
      }

      let options = {
         timeout: 7500
      }

      navigator.geolocation.getCurrentPosition(success, fail, options);
   }

   shouldComponentUpdate() {
      console.log("index.js re-rendered");
      return true;
   }

   componentDidMount() {
      // load sampledata
      // testing
      window.onload = () => {
         this.setState({
            weatherData: weatherSample,
            location: 'Test'
         })
      }
   }

   render() {
      return (
         <div className="main">
            <Header location={this.state.location} />

            <SearchBox locateCall={this.searchLocate} geoCall={this.handleGeo} />

            <AlertsBox alertData={this.state.weatherData.alerts} />
            {/* weatherData = data > currently */}
            <Currently weatherData={this.state.weatherData.currently} />

            <Minutely weatherData={this.state.weatherData.minutely} />
            {/* weatherData = data > daily > array */}
            <Weekly weatherData={this.state.weatherData.daily} />
            {/* weatherData = data > hourly > array  */}
            <Hourly weatherData={this.state.weatherData.hourly} />
         </div>
      )
   }
}

ReactDOM.render(
   <App />,
   document.querySelector("#root")
);

// export default App;
