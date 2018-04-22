import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Header } from './Header.js';
import { keys } from './config/config.js';
import { Currently } from './Currently.js';
import { Weekly } from './Weekly.js';
import { Hourly } from './Hourly.js';
import { SearchBox } from './SearchBox.js';
import { AlertsBox } from './AlertsBox.js';

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
      this.testFunc = this.testFunc.bind(this);
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
         this.setState({
            location: found.formatted_address
         })

         this.fetchWeather(found.geometry.location.lat, found.geometry.location.lng);
      // TODO: friendlier alert
      } else {
         console.log("Try a different query");
         return;
      }
   }

   fetchWeather(lat, long) {
      let darksky = `https://api.darksky.net/forecast/${keys.opendarksky}/${lat},${long}?exclude=flags`;

      fetch(darksky)
         .then(response => {
            if (response.ok) {
               return response.json();
            }
         })
         .then(data => {
            console.log(data);
            this.setState({
               weatherData: data
            })
         })
         .catch(error => {
            console.log(error);
         })
   }

   // TODO: update header with location
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

   // weathersample
   // TODO: Remove this near production
   testFunc() {
      console.log(weatherSample);
      this.setState({
         weatherData: weatherSample,
         location: '*Test* Los Angeles, CA'
      })
   }

   render() {
      return (
         <div className="main">
            <Header location={this.state.location} />

            <SearchBox locateCall={this.searchLocate} geoCall={this.handleGeo} testerCall={this.testFunc} />

            <AlertsBox alertData={this.state.weatherData.alerts}/>
            {/* weatherData = data > currently */}
            <Currently weatherData={this.state.weatherData.currently} />
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

// Remove this near production
const weatherSample = {
   "latitude": 37.8267,
   "longitude": -122.4233,
   "timezone": "America/Los_Angeles",
   "alerts": [
      {
        "title": "Tornado Watch",
        "regions": [
          "DeSoto",
          "Hardee",
          "Hernando",
          "Highlands",
          "Hillsborough",
          "Manatee",
          "Pasco",
          "Pinellas",
          "Polk",
          "Sarasota",
          "Sumter"
        ],
        "severity": "warning",
        "time": 1523820660,
        "expires": 1523829600,
        "description": "TORNADO WATCH 51 REMAINS VALID UNTIL 6 PM EDT THIS EVENING FOR THE FOLLOWING AREAS IN FLORIDA THIS WATCH INCLUDES 11 COUNTIES IN CENTRAL FLORIDA HARDEE POLK SUMTER IN SOUTH CENTRAL FLORIDA DESOTO HIGHLANDS IN WEST CENTRAL FLORIDA HERNANDO HILLSBOROUGH MANATEE PASCO PINELLAS SARASOTA THIS INCLUDES THE CITIES OF ARCADIA, AVON PARK, BAYSHORE GARDENS, BOWLING GREEN, BRADENTON, BRANDON, BROOKSVILLE, BUSHNELL, CLEARWATER, DADE CITY, ENGLEWOOD, HOLIDAY, HUDSON, JASMINE ESTATES, LAKE PANASOFFKEE, LAKELAND, LAND O LAKES, LARGO, NEW PORT RICHEY, NORTH PORT, PALMETTO, PLACID LAKES, SARASOTA, SEBRING, SOUTH VENICE, SPRING HILL, ST. PETERSBURG, TAMPA, THE VILLAGES, VENICE, WAUCHULA, WILDWOOD, WINTER HAVEN, ZEPHYRHILLS, AND ZOLFO SPRINGS.\n",
        "uri": "https://alerts.weather.gov/cap/wwacapget.php?x=FL125A9E7AA00C.TornadoWatch.125A9E7B0920FL.TBWWCNTBW.d4955ea95a6b73a025ec3a07c450081a"
      },
      {
        "title": "Rip Current Statement",
        "regions": [
          "Coastal Charlotte",
          "Coastal Hillsborough",
          "Coastal Lee",
          "Coastal Manatee",
          "Coastal Sarasota"
        ],
        "severity": "watch",
        "time": 1523819340,
        "expires": 1523998800,
        "description": "...HIGH RIP CURRENT RISK REMAINS IN EFFECT THROUGH TUESDAY AFTERNOON... ...HIGH SURF ADVISORY IN EFFECT FROM 8 PM THIS EVENING TO 8 PM EDT MONDAY... The National Weather Service in Tampa Bay Ruskin has issued a High Surf Advisory, which is in effect from 8 PM this evening to 8 PM EDT Monday. * HIGH SURF...Increasing northwest winds in the wake of a cold front will cause surf to build to 3 to 5 feet at area beaches. * HIGH SURF TIMING...Tonight through Monday night. * HIGH SURF IMPACTS...High surf may produce localized beach erosion and dangerous swimming conditions. * RIP CURRENT TIMING...Breezy winds and increasing wave action will create rip currents today, Monday, and Tuesday * RIP CURRENT IMPACTS...Strong rip currents will be hazardous for those in the surf zone along area beaches.\n",
        "uri": "https://alerts.weather.gov/cap/wwacapget.php?x=FL125A9E7A9774.RipCurrentStatement.125A9E996690FL.TBWCFWTBW.50bf33596c0e033b977e5e6e1070d300"
      },
      {
        "title": "Lake Wind Advisory",
        "regions": [
          "Coastal Charlotte",
          "Coastal Citrus",
          "Coastal Hernando",
          "Coastal Hillsborough",
          "Coastal Lee",
          "Coastal Levy",
          "Coastal Manatee",
          "Coastal Pasco",
          "Coastal Sarasota",
          "DeSoto",
          "Hardee",
          "Highlands",
          "Inland Charlotte",
          "Inland Citrus",
          "Inland Hernando",
          "Inland Hillsborough",
          "Inland Lee",
          "Inland Levy",
          "Inland Manatee",
          "Inland Pasco",
          "Inland Sarasota",
          "Pinellas",
          "Polk",
          "Sumter"
        ],
        "severity": "advisory",
        "time": 1523821020,
        "expires": 1523836800,
        "description": "...STRONG AND GUSTY WINDS WILL CONTINUE TO CREATE HAZARDOUS BOATING CONDITIONS ON AREA LAKES TODAY... ...LAKE WIND ADVISORY REMAINS IN EFFECT UNTIL 8 PM EDT THIS EVENING... * TIMING...Through 8 PM * WINDS...South to southwest 20 to 25 mph with higher gusts. * IMPACTS...Hazardous boating conditions on area lakes.\n",
        "uri": "https://alerts.weather.gov/cap/wwacapget.php?x=FL125A9E7AA264.LakeWindAdvisory.125A9E86F000FL.TBWNPWTBW.82497fff87003218cb987348621a0fe4"
      },
      {
        "title": "High Surf Advisory",
        "regions": [
          "Coastal Charlotte",
          "Coastal Hillsborough",
          "Coastal Lee",
          "Coastal Manatee",
          "Coastal Sarasota"
        ],
        "severity": "advisory",
        "time": 1523836800,
        "expires": 1523923200,
        "description": "...HIGH RIP CURRENT RISK REMAINS IN EFFECT THROUGH TUESDAY AFTERNOON... ...HIGH SURF ADVISORY IN EFFECT FROM 8 PM THIS EVENING TO 8 PM EDT MONDAY... The National Weather Service in Tampa Bay Ruskin has issued a High Surf Advisory, which is in effect from 8 PM this evening to 8 PM EDT Monday. * HIGH SURF...Increasing northwest winds in the wake of a cold front will cause surf to build to 3 to 5 feet at area beaches. * HIGH SURF TIMING...Tonight through Monday night. * HIGH SURF IMPACTS...High surf may produce localized beach erosion and dangerous swimming conditions. * RIP CURRENT TIMING...Breezy winds and increasing wave action will create rip currents today, Monday, and Tuesday * RIP CURRENT IMPACTS...Strong rip currents will be hazardous for those in the surf zone along area beaches.\n",
        "uri": "https://alerts.weather.gov/cap/wwacapget.php?x=FL125A9E7A9774.HighSurfAdvisory.125A9E963240FL.TBWCFWTBW.28379c5171a2d75af0436d73dc5f1038"
      }
    ],
   "currently": {
      "time": 1523061480,
      "summary": "Light Rain",
      "icon": "rain",
      "nearestStormDistance": 0,
      "precipIntensity": 0.012,
      "precipIntensityError": 0.005,
      "precipProbability": 1,
      "precipType": "rain",
      "temperature": 60.18,
      "apparentTemperature": 60.18,
      "dewPoint": 57.51,
      "humidity": 0.91,
      "pressure": 1011.23,
      "windSpeed": 9.77,
      "windGust": 14.51,
      "windBearing": 170,
      "cloudCover": 0.81,
      "uvIndex": 1,
      "visibility": 6.45,
      "ozone": 275.38
   },
   "minutely": {
      "summary": "Light rain stopping in 20 min.",
      "icon": "rain",
      "data": [
         {
            "time": 1523061480,
            "precipIntensity": 0.012,
            "precipIntensityError": 0.005,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061540,
            "precipIntensity": 0.017,
            "precipIntensityError": 0.007,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061600,
            "precipIntensity": 0.021,
            "precipIntensityError": 0.007,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061660,
            "precipIntensity": 0.021,
            "precipIntensityError": 0.005,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061720,
            "precipIntensity": 0.021,
            "precipIntensityError": 0.005,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061780,
            "precipIntensity": 0.02,
            "precipIntensityError": 0.005,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061840,
            "precipIntensity": 0.018,
            "precipIntensityError": 0.005,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061900,
            "precipIntensity": 0.016,
            "precipIntensityError": 0.006,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523061960,
            "precipIntensity": 0.015,
            "precipIntensityError": 0.007,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523062020,
            "precipIntensity": 0.015,
            "precipIntensityError": 0.008,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523062080,
            "precipIntensity": 0.014,
            "precipIntensityError": 0.009,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523062140,
            "precipIntensity": 0.013,
            "precipIntensityError": 0.009,
            "precipProbability": 1,
            "precipType": "rain"
         },
         {
            "time": 1523062200,
            "precipIntensity": 0.012,
            "precipIntensityError": 0.009,
            "precipProbability": 0.99,
            "precipType": "rain"
         },
         {
            "time": 1523062260,
            "precipIntensity": 0.011,
            "precipIntensityError": 0.008,
            "precipProbability": 0.98,
            "precipType": "rain"
         },
         {
            "time": 1523062320,
            "precipIntensity": 0.01,
            "precipIntensityError": 0.008,
            "precipProbability": 0.96,
            "precipType": "rain"
         },
         {
            "time": 1523062380,
            "precipIntensity": 0.008,
            "precipIntensityError": 0.007,
            "precipProbability": 0.93,
            "precipType": "rain"
         },
         {
            "time": 1523062440,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.89,
            "precipType": "rain"
         },
         {
            "time": 1523062500,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.85,
            "precipType": "rain"
         },
         {
            "time": 1523062560,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.005,
            "precipProbability": 0.82,
            "precipType": "rain"
         },
         {
            "time": 1523062620,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.005,
            "precipProbability": 0.79,
            "precipType": "rain"
         },
         {
            "time": 1523062680,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.004,
            "precipProbability": 0.76,
            "precipType": "rain"
         },
         {
            "time": 1523062740,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.005,
            "precipProbability": 0.71,
            "precipType": "rain"
         },
         {
            "time": 1523062800,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.004,
            "precipProbability": 0.68,
            "precipType": "rain"
         },
         {
            "time": 1523062860,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.005,
            "precipProbability": 0.63,
            "precipType": "rain"
         },
         {
            "time": 1523062920,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.005,
            "precipProbability": 0.57,
            "precipType": "rain"
         },
         {
            "time": 1523062980,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.005,
            "precipProbability": 0.52,
            "precipType": "rain"
         },
         {
            "time": 1523063040,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.006,
            "precipProbability": 0.45,
            "precipType": "rain"
         },
         {
            "time": 1523063100,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.006,
            "precipProbability": 0.41,
            "precipType": "rain"
         },
         {
            "time": 1523063160,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.005,
            "precipProbability": 0.35,
            "precipType": "rain"
         },
         {
            "time": 1523063220,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.006,
            "precipProbability": 0.32,
            "precipType": "rain"
         },
         {
            "time": 1523063280,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.007,
            "precipProbability": 0.27,
            "precipType": "rain"
         },
         {
            "time": 1523063340,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.007,
            "precipProbability": 0.25,
            "precipType": "rain"
         },
         {
            "time": 1523063400,
            "precipIntensity": 0.005,
            "precipIntensityError": 0.007,
            "precipProbability": 0.22,
            "precipType": "rain"
         },
         {
            "time": 1523063460,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.007,
            "precipProbability": 0.21,
            "precipType": "rain"
         },
         {
            "time": 1523063520,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523063580,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.008,
            "precipProbability": 0.18,
            "precipType": "rain"
         },
         {
            "time": 1523063640,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.007,
            "precipProbability": 0.18,
            "precipType": "rain"
         },
         {
            "time": 1523063700,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.007,
            "precipProbability": 0.18,
            "precipType": "rain"
         },
         {
            "time": 1523063760,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.008,
            "precipProbability": 0.18,
            "precipType": "rain"
         },
         {
            "time": 1523063820,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523063880,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523063940,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523064000,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523064060,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523064120,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.19,
            "precipType": "rain"
         },
         {
            "time": 1523064180,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.17,
            "precipType": "rain"
         },
         {
            "time": 1523064240,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.007,
            "precipProbability": 0.16,
            "precipType": "rain"
         },
         {
            "time": 1523064300,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.16,
            "precipType": "rain"
         },
         {
            "time": 1523064360,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.15,
            "precipType": "rain"
         },
         {
            "time": 1523064420,
            "precipIntensity": 0.008,
            "precipIntensityError": 0.007,
            "precipProbability": 0.14,
            "precipType": "rain"
         },
         {
            "time": 1523064480,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.13,
            "precipType": "rain"
         },
         {
            "time": 1523064540,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.13,
            "precipType": "rain"
         },
         {
            "time": 1523064600,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.11,
            "precipType": "rain"
         },
         {
            "time": 1523064660,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.11,
            "precipType": "rain"
         },
         {
            "time": 1523064720,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.1,
            "precipType": "rain"
         },
         {
            "time": 1523064780,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.005,
            "precipProbability": 0.09,
            "precipType": "rain"
         },
         {
            "time": 1523064840,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.006,
            "precipProbability": 0.08,
            "precipType": "rain"
         },
         {
            "time": 1523064900,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.006,
            "precipProbability": 0.08,
            "precipType": "rain"
         },
         {
            "time": 1523064960,
            "precipIntensity": 0.007,
            "precipIntensityError": 0.005,
            "precipProbability": 0.07,
            "precipType": "rain"
         },
         {
            "time": 1523065020,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.006,
            "precipProbability": 0.06,
            "precipType": "rain"
         },
         {
            "time": 1523065080,
            "precipIntensity": 0.006,
            "precipIntensityError": 0.004,
            "precipProbability": 0.06,
            "precipType": "rain"
         }
      ]
   },
   "hourly": {
      "summary": "Rain starting later this evening, continuing until tomorrow morning.",
      "icon": "rain",
      "data": [
         {
            "time": 1523059200,
            "summary": "Light Rain",
            "icon": "rain",
            "precipIntensity": 0.0341,
            "precipProbability": 0.84,
            "precipType": "rain",
            "temperature": 60.43,
            "apparentTemperature": 60.5,
            "dewPoint": 58.12,
            "humidity": 0.92,
            "pressure": 1011.54,
            "windSpeed": 9.53,
            "windGust": 12.73,
            "windBearing": 167,
            "cloudCover": 0.76,
            "uvIndex": 1,
            "visibility": 6.03,
            "ozone": 275.79
         },
         {
            "time": 1523062800,
            "summary": "Mostly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0.0126,
            "precipProbability": 0.78,
            "precipType": "rain",
            "temperature": 60.03,
            "apparentTemperature": 60.03,
            "dewPoint": 57.15,
            "humidity": 0.9,
            "pressure": 1011.05,
            "windSpeed": 9.92,
            "windGust": 15.54,
            "windBearing": 171,
            "cloudCover": 0.83,
            "uvIndex": 1,
            "visibility": 6.69,
            "ozone": 275.13
         },
         {
            "time": 1523066400,
            "summary": "Light Rain",
            "icon": "rain",
            "precipIntensity": 0.039,
            "precipProbability": 0.73,
            "precipType": "rain",
            "temperature": 59.69,
            "apparentTemperature": 59.69,
            "dewPoint": 56.33,
            "humidity": 0.89,
            "pressure": 1010.85,
            "windSpeed": 10.85,
            "windGust": 18.16,
            "windBearing": 175,
            "cloudCover": 0.89,
            "uvIndex": 0,
            "visibility": 7.32,
            "ozone": 274.62
         },
         {
            "time": 1523070000,
            "summary": "Light Rain",
            "icon": "rain",
            "precipIntensity": 0.046,
            "precipProbability": 0.7,
            "precipType": "rain",
            "temperature": 59.69,
            "apparentTemperature": 59.69,
            "dewPoint": 55.99,
            "humidity": 0.88,
            "pressure": 1010.73,
            "windSpeed": 10.87,
            "windGust": 19.54,
            "windBearing": 176,
            "cloudCover": 0.9,
            "uvIndex": 0,
            "visibility": 7.4,
            "ozone": 274.12
         },
         {
            "time": 1523073600,
            "summary": "Light Rain",
            "icon": "rain",
            "precipIntensity": 0.0436,
            "precipProbability": 0.68,
            "precipType": "rain",
            "temperature": 60,
            "apparentTemperature": 60,
            "dewPoint": 56.18,
            "humidity": 0.87,
            "pressure": 1010.89,
            "windSpeed": 10.6,
            "windGust": 18.57,
            "windBearing": 176,
            "cloudCover": 0.92,
            "uvIndex": 0,
            "visibility": 6.66,
            "ozone": 273.51
         },
         {
            "time": 1523077200,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.0855,
            "precipProbability": 0.77,
            "precipType": "rain",
            "temperature": 60.01,
            "apparentTemperature": 60.01,
            "dewPoint": 56.52,
            "humidity": 0.88,
            "pressure": 1011.28,
            "windSpeed": 10.48,
            "windGust": 18.2,
            "windBearing": 176,
            "cloudCover": 0.93,
            "uvIndex": 0,
            "visibility": 3.88,
            "ozone": 272.89
         },
         {
            "time": 1523080800,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.0549,
            "precipProbability": 0.73,
            "precipType": "rain",
            "temperature": 59.97,
            "apparentTemperature": 59.97,
            "dewPoint": 56.75,
            "humidity": 0.89,
            "pressure": 1011.25,
            "windSpeed": 11,
            "windGust": 18.89,
            "windBearing": 179,
            "cloudCover": 0.94,
            "uvIndex": 0,
            "visibility": 4.63,
            "ozone": 272.49
         },
         {
            "time": 1523084400,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.0651,
            "precipProbability": 0.77,
            "precipType": "rain",
            "temperature": 59.83,
            "apparentTemperature": 59.83,
            "dewPoint": 56.95,
            "humidity": 0.9,
            "pressure": 1010.9,
            "windSpeed": 11.57,
            "windGust": 20.07,
            "windBearing": 182,
            "cloudCover": 0.95,
            "uvIndex": 0,
            "visibility": 4.42,
            "ozone": 272.21
         },
         {
            "time": 1523088000,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.0809,
            "precipProbability": 0.81,
            "precipType": "rain",
            "temperature": 59.1,
            "apparentTemperature": 59.11,
            "dewPoint": 57.25,
            "humidity": 0.94,
            "pressure": 1010.27,
            "windSpeed": 12.27,
            "windGust": 21.69,
            "windBearing": 184,
            "cloudCover": 0.96,
            "uvIndex": 0,
            "visibility": 4.18,
            "ozone": 272.16
         },
         {
            "time": 1523091600,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.148,
            "precipProbability": 0.87,
            "precipType": "rain",
            "temperature": 58.43,
            "apparentTemperature": 58.49,
            "dewPoint": 57.3,
            "humidity": 0.96,
            "pressure": 1010,
            "windSpeed": 12.9,
            "windGust": 22.93,
            "windBearing": 190,
            "cloudCover": 0.93,
            "uvIndex": 0,
            "visibility": 2.73,
            "ozone": 272.15
         },
         {
            "time": 1523095200,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.1205,
            "precipProbability": 0.86,
            "precipType": "rain",
            "temperature": 58.2,
            "apparentTemperature": 58.27,
            "dewPoint": 57.3,
            "humidity": 0.97,
            "pressure": 1010.17,
            "windSpeed": 13.15,
            "windGust": 23.41,
            "windBearing": 204,
            "cloudCover": 0.96,
            "uvIndex": 0,
            "visibility": 4.17,
            "ozone": 271.81
         },
         {
            "time": 1523098800,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.1527,
            "precipProbability": 0.87,
            "precipType": "rain",
            "temperature": 58.61,
            "apparentTemperature": 58.65,
            "dewPoint": 57.25,
            "humidity": 0.95,
            "pressure": 1010.51,
            "windSpeed": 12.93,
            "windGust": 23.69,
            "windBearing": 221,
            "cloudCover": 0.97,
            "uvIndex": 0,
            "visibility": 3.88,
            "ozone": 271.45
         },
         {
            "time": 1523102400,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.1522,
            "precipProbability": 0.85,
            "precipType": "rain",
            "temperature": 59.17,
            "apparentTemperature": 59.17,
            "dewPoint": 56.99,
            "humidity": 0.92,
            "pressure": 1011.08,
            "windSpeed": 12.51,
            "windGust": 22.37,
            "windBearing": 233,
            "cloudCover": 0.95,
            "uvIndex": 0,
            "visibility": 5.1,
            "ozone": 272.55
         },
         {
            "time": 1523106000,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.1129,
            "precipProbability": 0.82,
            "precipType": "rain",
            "temperature": 59.46,
            "apparentTemperature": 59.46,
            "dewPoint": 56.13,
            "humidity": 0.89,
            "pressure": 1011.76,
            "windSpeed": 12.62,
            "windGust": 24.51,
            "windBearing": 227,
            "cloudCover": 1,
            "uvIndex": 0,
            "visibility": 9.28,
            "ozone": 275.88
         },
         {
            "time": 1523109600,
            "summary": "Rain",
            "icon": "rain",
            "precipIntensity": 0.055,
            "precipProbability": 0.68,
            "precipType": "rain",
            "temperature": 59.06,
            "apparentTemperature": 59.06,
            "dewPoint": 55.09,
            "humidity": 0.87,
            "pressure": 1012.4,
            "windSpeed": 12.22,
            "windGust": 23.19,
            "windBearing": 269,
            "cloudCover": 0.99,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 280.53
         },
         {
            "time": 1523113200,
            "summary": "Light Rain",
            "icon": "rain",
            "precipIntensity": 0.0324,
            "precipProbability": 0.53,
            "precipType": "rain",
            "temperature": 58.74,
            "apparentTemperature": 58.74,
            "dewPoint": 54.19,
            "humidity": 0.85,
            "pressure": 1013.12,
            "windSpeed": 11.92,
            "windGust": 21.8,
            "windBearing": 262,
            "cloudCover": 0.99,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 284.61
         },
         {
            "time": 1523116800,
            "summary": "Overcast",
            "icon": "cloudy",
            "precipIntensity": 0.0163,
            "precipProbability": 0.33,
            "precipType": "rain",
            "temperature": 58.89,
            "apparentTemperature": 58.89,
            "dewPoint": 53.69,
            "humidity": 0.83,
            "pressure": 1013.98,
            "windSpeed": 11.4,
            "windGust": 20.49,
            "windBearing": 251,
            "cloudCover": 0.99,
            "uvIndex": 1,
            "visibility": 10,
            "ozone": 287.35
         },
         {
            "time": 1523120400,
            "summary": "Overcast",
            "icon": "cloudy",
            "precipIntensity": 0.0042,
            "precipProbability": 0.11,
            "precipType": "rain",
            "temperature": 59.3,
            "apparentTemperature": 59.3,
            "dewPoint": 53.35,
            "humidity": 0.81,
            "pressure": 1014.93,
            "windSpeed": 11.01,
            "windGust": 19.03,
            "windBearing": 272,
            "cloudCover": 0.98,
            "uvIndex": 2,
            "visibility": 10,
            "ozone": 289.48
         },
         {
            "time": 1523124000,
            "summary": "Overcast",
            "icon": "cloudy",
            "precipIntensity": 0.0008,
            "precipProbability": 0.04,
            "precipType": "rain",
            "temperature": 59.78,
            "apparentTemperature": 59.78,
            "dewPoint": 52.97,
            "humidity": 0.78,
            "pressure": 1015.76,
            "windSpeed": 10.85,
            "windGust": 17.67,
            "windBearing": 264,
            "cloudCover": 0.96,
            "uvIndex": 3,
            "visibility": 10,
            "ozone": 291.2
         },
         {
            "time": 1523127600,
            "summary": "Mostly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0.0004,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 60.2,
            "apparentTemperature": 60.2,
            "dewPoint": 52.34,
            "humidity": 0.75,
            "pressure": 1016.43,
            "windSpeed": 10.61,
            "windGust": 16.47,
            "windBearing": 294,
            "cloudCover": 0.86,
            "uvIndex": 4,
            "visibility": 10,
            "ozone": 292.13
         },
         {
            "time": 1523131200,
            "summary": "Mostly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0.0002,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 60.83,
            "apparentTemperature": 60.83,
            "dewPoint": 51.65,
            "humidity": 0.72,
            "pressure": 1017,
            "windSpeed": 10.84,
            "windGust": 15.48,
            "windBearing": 225,
            "cloudCover": 0.73,
            "uvIndex": 6,
            "visibility": 10,
            "ozone": 292.59
         },
         {
            "time": 1523134800,
            "summary": "Mostly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0.0002,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 61.32,
            "apparentTemperature": 61.32,
            "dewPoint": 51.07,
            "humidity": 0.69,
            "pressure": 1017.37,
            "windSpeed": 11.5,
            "windGust": 14.99,
            "windBearing": 261,
            "cloudCover": 0.61,
            "uvIndex": 6,
            "visibility": 10,
            "ozone": 294
         },
         {
            "time": 1523138400,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 61.68,
            "apparentTemperature": 61.68,
            "dewPoint": 50.69,
            "humidity": 0.67,
            "pressure": 1017.51,
            "windSpeed": 11.19,
            "windGust": 15.43,
            "windBearing": 248,
            "cloudCover": 0.54,
            "uvIndex": 4,
            "visibility": 10,
            "ozone": 296.9
         },
         {
            "time": 1523142000,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 61.76,
            "apparentTemperature": 61.76,
            "dewPoint": 50.46,
            "humidity": 0.66,
            "pressure": 1017.46,
            "windSpeed": 11.35,
            "windGust": 16.38,
            "windBearing": 278,
            "cloudCover": 0.48,
            "uvIndex": 3,
            "visibility": 10,
            "ozone": 300.8
         },
         {
            "time": 1523145600,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 61.6,
            "apparentTemperature": 61.6,
            "dewPoint": 50.24,
            "humidity": 0.66,
            "pressure": 1017.51,
            "windSpeed": 11.66,
            "windGust": 16.86,
            "windBearing": 261,
            "cloudCover": 0.42,
            "uvIndex": 1,
            "visibility": 10,
            "ozone": 304.92
         },
         {
            "time": 1523149200,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 60.81,
            "apparentTemperature": 60.81,
            "dewPoint": 50.08,
            "humidity": 0.68,
            "pressure": 1017.72,
            "windSpeed": 10.99,
            "windGust": 16.56,
            "windBearing": 252,
            "cloudCover": 0.38,
            "uvIndex": 1,
            "visibility": 10,
            "ozone": 310.06
         },
         {
            "time": 1523152800,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 59.8,
            "apparentTemperature": 59.8,
            "dewPoint": 49.91,
            "humidity": 0.7,
            "pressure": 1018.02,
            "windSpeed": 10.74,
            "windGust": 15.8,
            "windBearing": 280,
            "cloudCover": 0.34,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 315.5
         },
         {
            "time": 1523156400,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0003,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 58.77,
            "apparentTemperature": 58.77,
            "dewPoint": 49.71,
            "humidity": 0.72,
            "pressure": 1018.45,
            "windSpeed": 10.26,
            "windGust": 14.64,
            "windBearing": 269,
            "cloudCover": 0.32,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 318.76
         },
         {
            "time": 1523160000,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0003,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 58.07,
            "apparentTemperature": 58.07,
            "dewPoint": 49.39,
            "humidity": 0.73,
            "pressure": 1019.17,
            "windSpeed": 8.36,
            "windGust": 12.88,
            "windBearing": 220,
            "cloudCover": 0.31,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 318.2
         },
         {
            "time": 1523163600,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0003,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 57.42,
            "apparentTemperature": 57.42,
            "dewPoint": 49.02,
            "humidity": 0.74,
            "pressure": 1020.06,
            "windSpeed": 6.61,
            "windGust": 10.7,
            "windBearing": 322,
            "cloudCover": 0.33,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 315.39
         },
         {
            "time": 1523167200,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0003,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 56.45,
            "apparentTemperature": 56.45,
            "dewPoint": 48.7,
            "humidity": 0.75,
            "pressure": 1020.79,
            "windSpeed": 7.02,
            "windGust": 8.8,
            "windBearing": 281,
            "cloudCover": 0.33,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 312.73
         },
         {
            "time": 1523170800,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0002,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 55.29,
            "apparentTemperature": 55.29,
            "dewPoint": 48.46,
            "humidity": 0.78,
            "pressure": 1021.26,
            "windSpeed": 6.5,
            "windGust": 7.39,
            "windBearing": 278,
            "cloudCover": 0.32,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 311.02
         },
         {
            "time": 1523174400,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 53.93,
            "apparentTemperature": 53.93,
            "dewPoint": 48.25,
            "humidity": 0.81,
            "pressure": 1021.62,
            "windSpeed": 6.09,
            "windGust": 6.35,
            "windBearing": 276,
            "cloudCover": 0.3,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 309.4
         },
         {
            "time": 1523178000,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 52.81,
            "apparentTemperature": 52.81,
            "dewPoint": 48.06,
            "humidity": 0.84,
            "pressure": 1021.84,
            "windSpeed": 5.88,
            "windGust": 6.01,
            "windBearing": 283,
            "cloudCover": 0.28,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 307.9
         },
         {
            "time": 1523181600,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0002,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 52.28,
            "apparentTemperature": 52.28,
            "dewPoint": 47.82,
            "humidity": 0.85,
            "pressure": 1021.89,
            "windSpeed": 5.43,
            "windGust": 5.85,
            "windBearing": 279,
            "cloudCover": 0.27,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 306.35
         },
         {
            "time": 1523185200,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0004,
            "precipProbability": 0.03,
            "precipType": "rain",
            "temperature": 52.48,
            "apparentTemperature": 52.48,
            "dewPoint": 47.57,
            "humidity": 0.83,
            "pressure": 1021.79,
            "windSpeed": 5.76,
            "windGust": 5.8,
            "windBearing": 305,
            "cloudCover": 0.26,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 304.99
         },
         {
            "time": 1523188800,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0005,
            "precipProbability": 0.03,
            "precipType": "rain",
            "temperature": 53.12,
            "apparentTemperature": 53.12,
            "dewPoint": 47.39,
            "humidity": 0.81,
            "pressure": 1021.83,
            "windSpeed": 5.69,
            "windGust": 5.82,
            "windBearing": 297,
            "cloudCover": 0.26,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 303.97
         },
         {
            "time": 1523192400,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-night",
            "precipIntensity": 0.0004,
            "precipProbability": 0.02,
            "precipType": "rain",
            "temperature": 53.88,
            "apparentTemperature": 53.88,
            "dewPoint": 47.39,
            "humidity": 0.79,
            "pressure": 1022.13,
            "windSpeed": 5.47,
            "windGust": 5.95,
            "windBearing": 295,
            "cloudCover": 0.26,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 303.45
         },
         {
            "time": 1523196000,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 54.4,
            "apparentTemperature": 54.4,
            "dewPoint": 47.44,
            "humidity": 0.77,
            "pressure": 1022.57,
            "windSpeed": 5.91,
            "windGust": 6.37,
            "windBearing": 319,
            "cloudCover": 0.27,
            "uvIndex": 0,
            "visibility": 10,
            "ozone": 303.37
         },
         {
            "time": 1523199600,
            "summary": "Partly Cloudy",
            "icon": "partly-cloudy-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 55.04,
            "apparentTemperature": 55.04,
            "dewPoint": 47.45,
            "humidity": 0.76,
            "pressure": 1022.95,
            "windSpeed": 5.94,
            "windGust": 7.01,
            "windBearing": 316,
            "cloudCover": 0.26,
            "uvIndex": 1,
            "visibility": 10,
            "ozone": 303.85
         },
         {
            "time": 1523203200,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 56.35,
            "apparentTemperature": 56.35,
            "dewPoint": 47.29,
            "humidity": 0.72,
            "pressure": 1023.24,
            "windSpeed": 5.8,
            "windGust": 7.47,
            "windBearing": 314,
            "cloudCover": 0.23,
            "uvIndex": 1,
            "visibility": 10,
            "ozone": 305.22
         },
         {
            "time": 1523206800,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 58.17,
            "apparentTemperature": 58.17,
            "dewPoint": 47.1,
            "humidity": 0.67,
            "pressure": 1023.52,
            "windSpeed": 5.69,
            "windGust": 7.93,
            "windBearing": 314,
            "cloudCover": 0.19,
            "uvIndex": 3,
            "visibility": 10,
            "ozone": 307.12
         },
         {
            "time": 1523210400,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 59.82,
            "apparentTemperature": 59.82,
            "dewPoint": 46.97,
            "humidity": 0.62,
            "pressure": 1023.71,
            "windSpeed": 5.92,
            "windGust": 8.53,
            "windBearing": 315,
            "cloudCover": 0.15,
            "uvIndex": 5,
            "visibility": 10,
            "ozone": 308.65
         },
         {
            "time": 1523214000,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 61.01,
            "apparentTemperature": 61.01,
            "dewPoint": 47.02,
            "humidity": 0.6,
            "pressure": 1023.82,
            "windSpeed": 6.8,
            "windGust": 9.38,
            "windBearing": 308,
            "cloudCover": 0.13,
            "uvIndex": 7,
            "visibility": 10,
            "ozone": 309.49
         },
         {
            "time": 1523217600,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 62.06,
            "apparentTemperature": 62.06,
            "dewPoint": 47.16,
            "humidity": 0.58,
            "pressure": 1023.86,
            "windSpeed": 8.05,
            "windGust": 10.39,
            "windBearing": 289,
            "cloudCover": 0.12,
            "uvIndex": 8,
            "visibility": 10,
            "ozone": 309.96
         },
         {
            "time": 1523221200,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 62.81,
            "apparentTemperature": 62.81,
            "dewPoint": 47.25,
            "humidity": 0.57,
            "pressure": 1023.73,
            "windSpeed": 9.3,
            "windGust": 11.44,
            "windBearing": 287,
            "cloudCover": 0.11,
            "uvIndex": 7,
            "visibility": 10,
            "ozone": 310.42
         },
         {
            "time": 1523224800,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 63.33,
            "apparentTemperature": 63.33,
            "dewPoint": 47.35,
            "humidity": 0.56,
            "pressure": 1023.31,
            "windSpeed": 9.95,
            "windGust": 12.57,
            "windBearing": 281,
            "cloudCover": 0.1,
            "uvIndex": 6,
            "visibility": 10,
            "ozone": 311.07
         },
         {
            "time": 1523228400,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 63.39,
            "apparentTemperature": 63.39,
            "dewPoint": 47.44,
            "humidity": 0.56,
            "pressure": 1022.69,
            "windSpeed": 10.58,
            "windGust": 13.72,
            "windBearing": 298,
            "cloudCover": 0.08,
            "uvIndex": 3,
            "visibility": 10,
            "ozone": 311.72
         },
         {
            "time": 1523232000,
            "summary": "Clear",
            "icon": "clear-day",
            "precipIntensity": 0,
            "precipProbability": 0,
            "temperature": 62.92,
            "apparentTemperature": 62.92,
            "dewPoint": 47.44,
            "humidity": 0.57,
            "pressure": 1022.25,
            "windSpeed": 10.94,
            "windGust": 14.46,
            "windBearing": 292,
            "cloudCover": 0.06,
            "uvIndex": 2,
            "visibility": 10,
            "ozone": 312.24
         }
      ]
   },
   "daily": {
      "summary": "Rain today and tomorrow, with high temperatures peaking at 68°F on Monday.",
      "icon": "rain",
      "data": [
         {
            "time": 1522998000,
            "summary": "Rain throughout the day.",
            "icon": "rain",
            "sunriseTime": 1523022481,
            "sunsetTime": 1523068686,
            "moonPhase": 0.71,
            "precipIntensity": 0.0488,
            "precipIntensityMax": 0.1063,
            "precipIntensityMaxTime": 1523026800,
            "precipProbability": 1,
            "precipType": "rain",
            "temperatureHigh": 60.56,
            "temperatureHighTime": 1523055600,
            "temperatureLow": 58.2,
            "temperatureLowTime": 1523095200,
            "apparentTemperatureHigh": 60.73,
            "apparentTemperatureHighTime": 1523055600,
            "apparentTemperatureLow": 58.27,
            "apparentTemperatureLowTime": 1523095200,
            "dewPoint": 56.42,
            "humidity": 0.93,
            "pressure": 1013.34,
            "windSpeed": 9.35,
            "windGust": 19.54,
            "windGustTime": 1523070000,
            "windBearing": 156,
            "cloudCover": 0.73,
            "uvIndex": 6,
            "uvIndexTime": 1523044800,
            "visibility": 5.38,
            "ozone": 280.4,
            "temperatureMin": 56.01,
            "temperatureMinTime": 1522998000,
            "temperatureMax": 60.56,
            "temperatureMaxTime": 1523055600,
            "apparentTemperatureMin": 56.01,
            "apparentTemperatureMinTime": 1522998000,
            "apparentTemperatureMax": 60.73,
            "apparentTemperatureMaxTime": 1523055600
         },
         {
            "time": 1523084400,
            "summary": "Rain in the morning.",
            "icon": "rain",
            "sunriseTime": 1523108792,
            "sunsetTime": 1523155141,
            "moonPhase": 0.74,
            "precipIntensity": 0.0393,
            "precipIntensityMax": 0.1527,
            "precipIntensityMaxTime": 1523098800,
            "precipProbability": 0.97,
            "precipType": "rain",
            "temperatureHigh": 61.76,
            "temperatureHighTime": 1523142000,
            "temperatureLow": 52.28,
            "temperatureLowTime": 1523181600,
            "apparentTemperatureHigh": 61.76,
            "apparentTemperatureHighTime": 1523142000,
            "apparentTemperatureLow": 52.28,
            "apparentTemperatureLowTime": 1523181600,
            "dewPoint": 52.99,
            "humidity": 0.8,
            "pressure": 1015.1,
            "windSpeed": 9.27,
            "windGust": 24.51,
            "windGustTime": 1523106000,
            "windBearing": 246,
            "cloudCover": 0.72,
            "uvIndex": 6,
            "uvIndexTime": 1523131200,
            "visibility": 10,
            "ozone": 292.22,
            "temperatureMin": 56.45,
            "temperatureMinTime": 1523167200,
            "temperatureMax": 61.76,
            "temperatureMaxTime": 1523142000,
            "apparentTemperatureMin": 56.45,
            "apparentTemperatureMinTime": 1523167200,
            "apparentTemperatureMax": 61.76,
            "apparentTemperatureMaxTime": 1523142000
         },
         {
            "time": 1523170800,
            "summary": "Partly cloudy in the morning.",
            "icon": "partly-cloudy-night",
            "sunriseTime": 1523195104,
            "sunsetTime": 1523241595,
            "moonPhase": 0.77,
            "precipIntensity": 0.0001,
            "precipIntensityMax": 0.0005,
            "precipIntensityMaxTime": 1523188800,
            "precipProbability": 0.08,
            "precipType": "rain",
            "temperatureHigh": 63.39,
            "temperatureHighTime": 1523228400,
            "temperatureLow": 49.42,
            "temperatureLowTime": 1523271600,
            "apparentTemperatureHigh": 63.39,
            "apparentTemperatureHighTime": 1523228400,
            "apparentTemperatureLow": 49.26,
            "apparentTemperatureLowTime": 1523268000,
            "dewPoint": 47.35,
            "humidity": 0.7,
            "pressure": 1022.53,
            "windSpeed": 7.23,
            "windGust": 14.78,
            "windGustTime": 1523235600,
            "windBearing": 298,
            "cloudCover": 0.16,
            "uvIndex": 8,
            "uvIndexTime": 1523217600,
            "visibility": 10,
            "ozone": 309.19,
            "temperatureMin": 52.28,
            "temperatureMinTime": 1523181600,
            "temperatureMax": 63.39,
            "temperatureMaxTime": 1523228400,
            "apparentTemperatureMin": 52.28,
            "apparentTemperatureMinTime": 1523181600,
            "apparentTemperatureMax": 63.39,
            "apparentTemperatureMaxTime": 1523228400
         },
         {
            "time": 1523257200,
            "summary": "Partly cloudy throughout the day.",
            "icon": "partly-cloudy-day",
            "sunriseTime": 1523281416,
            "sunsetTime": 1523328050,
            "moonPhase": 0.8,
            "precipIntensity": 0.0002,
            "precipIntensityMax": 0.0005,
            "precipIntensityMaxTime": 1523286000,
            "precipProbability": 0.1,
            "precipType": "rain",
            "temperatureHigh": 68.22,
            "temperatureHighTime": 1523318400,
            "temperatureLow": 53.66,
            "temperatureLowTime": 1523358000,
            "apparentTemperatureHigh": 68.22,
            "apparentTemperatureHighTime": 1523318400,
            "apparentTemperatureLow": 53.66,
            "apparentTemperatureLowTime": 1523358000,
            "dewPoint": 48.3,
            "humidity": 0.71,
            "pressure": 1019.37,
            "windSpeed": 2.39,
            "windGust": 7.68,
            "windGustTime": 1523307600,
            "windBearing": 346,
            "cloudCover": 0.44,
            "uvIndex": 6,
            "uvIndexTime": 1523304000,
            "visibility": 10,
            "ozone": 305.64,
            "temperatureMin": 49.42,
            "temperatureMinTime": 1523271600,
            "temperatureMax": 68.22,
            "temperatureMaxTime": 1523318400,
            "apparentTemperatureMin": 49.26,
            "apparentTemperatureMinTime": 1523268000,
            "apparentTemperatureMax": 68.22,
            "apparentTemperatureMaxTime": 1523318400
         },
         {
            "time": 1523343600,
            "summary": "Mostly cloudy until evening.",
            "icon": "partly-cloudy-day",
            "sunriseTime": 1523367729,
            "sunsetTime": 1523414505,
            "moonPhase": 0.83,
            "precipIntensity": 0.0002,
            "precipIntensityMax": 0.001,
            "precipIntensityMaxTime": 1523386800,
            "precipProbability": 0.05,
            "precipType": "rain",
            "temperatureHigh": 62.76,
            "temperatureHighTime": 1523404800,
            "temperatureLow": 51.29,
            "temperatureLowTime": 1523444400,
            "apparentTemperatureHigh": 62.76,
            "apparentTemperatureHighTime": 1523404800,
            "apparentTemperatureLow": 51.29,
            "apparentTemperatureLowTime": 1523444400,
            "dewPoint": 50.04,
            "humidity": 0.75,
            "pressure": 1019.27,
            "windSpeed": 3.99,
            "windGust": 11.31,
            "windGustTime": 1523412000,
            "windBearing": 265,
            "cloudCover": 0.79,
            "uvIndex": 5,
            "uvIndexTime": 1523390400,
            "ozone": 312.62,
            "temperatureMin": 53.66,
            "temperatureMinTime": 1523358000,
            "temperatureMax": 62.76,
            "temperatureMaxTime": 1523404800,
            "apparentTemperatureMin": 53.66,
            "apparentTemperatureMinTime": 1523358000,
            "apparentTemperatureMax": 62.76,
            "apparentTemperatureMaxTime": 1523404800
         },
         {
            "time": 1523430000,
            "summary": "Mostly cloudy throughout the day and breezy overnight.",
            "icon": "wind",
            "sunriseTime": 1523454042,
            "sunsetTime": 1523500960,
            "moonPhase": 0.86,
            "precipIntensity": 0.0025,
            "precipIntensityMax": 0.0113,
            "precipIntensityMaxTime": 1523512800,
            "precipProbability": 0.19,
            "precipType": "rain",
            "temperatureHigh": 60.92,
            "temperatureHighTime": 1523480400,
            "temperatureLow": 48.76,
            "temperatureLowTime": 1523527200,
            "apparentTemperatureHigh": 60.92,
            "apparentTemperatureHighTime": 1523480400,
            "apparentTemperatureLow": 42.92,
            "apparentTemperatureLowTime": 1523527200,
            "dewPoint": 47.02,
            "humidity": 0.74,
            "pressure": 1017.75,
            "windSpeed": 7.96,
            "windGust": 27.43,
            "windGustTime": 1523494800,
            "windBearing": 262,
            "cloudCover": 0.65,
            "uvIndex": 5,
            "uvIndexTime": 1523476800,
            "ozone": 321.78,
            "temperatureMin": 51.29,
            "temperatureMinTime": 1523444400,
            "temperatureMax": 60.92,
            "temperatureMaxTime": 1523480400,
            "apparentTemperatureMin": 51.29,
            "apparentTemperatureMinTime": 1523444400,
            "apparentTemperatureMax": 60.92,
            "apparentTemperatureMaxTime": 1523480400
         },
         {
            "time": 1523516400,
            "summary": "Clear throughout the day.",
            "icon": "clear-day",
            "sunriseTime": 1523540356,
            "sunsetTime": 1523587415,
            "moonPhase": 0.89,
            "precipIntensity": 0.0009,
            "precipIntensityMax": 0.0091,
            "precipIntensityMaxTime": 1523516400,
            "precipProbability": 0.23,
            "precipType": "rain",
            "temperatureHigh": 60.38,
            "temperatureHighTime": 1523574000,
            "temperatureLow": 49.43,
            "temperatureLowTime": 1523620800,
            "apparentTemperatureHigh": 60.38,
            "apparentTemperatureHighTime": 1523574000,
            "apparentTemperatureLow": 46.55,
            "apparentTemperatureLowTime": 1523617200,
            "dewPoint": 39.92,
            "humidity": 0.57,
            "pressure": 1024.34,
            "windSpeed": 12.79,
            "windGust": 25.78,
            "windGustTime": 1523516400,
            "windBearing": 303,
            "cloudCover": 0.13,
            "uvIndex": 8,
            "uvIndexTime": 1523563200,
            "ozone": 355.31,
            "temperatureMin": 48.76,
            "temperatureMinTime": 1523527200,
            "temperatureMax": 60.38,
            "temperatureMaxTime": 1523574000,
            "apparentTemperatureMin": 42.92,
            "apparentTemperatureMinTime": 1523527200,
            "apparentTemperatureMax": 60.38,
            "apparentTemperatureMaxTime": 1523574000
         },
         {
            "time": 1523602800,
            "summary": "Mostly cloudy starting in the evening.",
            "icon": "partly-cloudy-night",
            "sunriseTime": 1523626671,
            "sunsetTime": 1523673870,
            "moonPhase": 0.92,
            "precipIntensity": 0,
            "precipIntensityMax": 0.0002,
            "precipIntensityMaxTime": 1523685600,
            "precipProbability": 0,
            "temperatureHigh": 66.49,
            "temperatureHighTime": 1523656800,
            "temperatureLow": 49.19,
            "temperatureLowTime": 1523700000,
            "apparentTemperatureHigh": 66.49,
            "apparentTemperatureHighTime": 1523656800,
            "apparentTemperatureLow": 47.17,
            "apparentTemperatureLowTime": 1523703600,
            "dewPoint": 41.1,
            "humidity": 0.56,
            "pressure": 1025.28,
            "windSpeed": 5.99,
            "windGust": 15.91,
            "windGustTime": 1523602800,
            "windBearing": 315,
            "cloudCover": 0.19,
            "uvIndex": 9,
            "uvIndexTime": 1523649600,
            "ozone": 321.48,
            "temperatureMin": 49.43,
            "temperatureMinTime": 1523620800,
            "temperatureMax": 66.49,
            "temperatureMaxTime": 1523656800,
            "apparentTemperatureMin": 46.55,
            "apparentTemperatureMinTime": 1523617200,
            "apparentTemperatureMax": 66.49,
            "apparentTemperatureMaxTime": 1523656800
         }
      ]
   },
   "flags": {
      "sources": [
         "isd",
         "nearest-precip",
         "nwspa",
         "cmc",
         "gfs",
         "hrrr",
         "madis",
         "nam",
         "sref",
         "darksky"
      ],
      "isd-stations": [
         "724943-99999",
         "745039-99999",
         "745045-99999",
         "745060-23239",
         "745065-99999",
         "994016-99999",
         "994033-99999",
         "994036-99999",
         "997734-99999",
         "998197-99999",
         "998476-99999",
         "998477-99999",
         "998479-99999",
         "998496-99999",
         "999999-23239",
         "999999-23272"
      ],
      "units": "us"
   },
   "offset": -7
}