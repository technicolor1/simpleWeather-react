import React from 'react';

const Google = window.google;

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.handleGeoBtnClicked = this.handleGeoBtnClicked.bind(this);
   }

   // except for geoBtn, it doesn't need inputfield
   handleGeoBtnClicked(uri) {
      this.props.fetchLocation(uri);
   }

   handleAutocompletePlaceChanged = (googledata) => {
      this.props.fetchWeather(googledata);
   }

   render() {
      return (
         <div className="controls">
            <GeoButton onBtnClicked={this.handleGeoBtnClicked} />
            <InputField
               onAutocompletePlaceChanged={this.handleAutocompletePlaceChanged}
            />
            <LocateButton onBtnClicked={this.handleUserInputs} />
         </div>
      )
   }
}

class InputField extends React.Component {
   constructor() {
      super()

      this.googlebox = null;

      this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
   }

   handlePlaceChanged() {
      // getplace
      var place = this.googlebox.getPlace();
      console.log(place);
      let googledata = {
         location: place.formatted_address,
         lat: place.geometry.location.lat(),
         long: place.geometry.location.lng()
      }
      console.log(googledata);
      this.props.onAutocompletePlaceChanged(googledata);
   }

   // attach google autocomplete
   componentDidMount() {
      // set autocomplete to only regions
      var options = {
         types: ['(regions)']
      };

      // for some reason google does not like react refs ¯\_(ツ)_/¯
      var input = document.querySelector("#pac-input");
      // autocomplete
      var searchBox = new Google.maps.places.Autocomplete(input, options);
      this.googlebox = searchBox;
      // eventlistener
      searchBox.addListener("place_changed", this.handlePlaceChanged);
   }

   render() {
      return (
         <input
            autoFocus
            onFocus={this.highlightText}
            id="pac-input"
            className="searchbox"
            type="text"
            placeholder="City, Zip, Locale"
         />
      )
   }
}

class LocateButton extends React.Component {
   constructor() {
      super()
   }

   render() {
      return (
         <button name="submit-location">
            <i className="fas fa-chevron-right" />
         </button>
      )
   }
}

class GeoButton extends React.Component {
   constructor() {
      super()

      this.handleClick = this.handleClick.bind(this);
   }

   handleClick() {
      let self = this;

      function success(pos) {
         let GeolocateUri = `json?latlng=${pos.coords.latitude},${pos.coords.longitude}`;
         self.props.onBtnClicked(GeolocateUri);
      }

      function fail(error) {
         console.log(error);
      }

      let options = {
         timeout: 7500
      }

      navigator.geolocation.getCurrentPosition(success, fail, options);
   }

   render() {
      return (
         <button name="locater" onClick={this.handleClick}>
            <i className="fas fa-location-arrow" />
         </button>
      )
   }
}
