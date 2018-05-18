import React from 'react';

const Google = window.google;

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.handleAutocompletePlaceChanged = this.handleAutocompletePlaceChanged.bind(this);
      this.handleRefresh = this.handleRefresh.bind(this);
   }

   handleAutocompletePlaceChanged(googledata) {
      this.props.fetchWeather(googledata);
   }

   handleRefresh() {
      this.props.onRefreshClicked();
   }

   render() {
      return (
         <div className="controls">
            <InputField
               onAutocompletePlaceChanged={this.handleAutocompletePlaceChanged}
            />
            <RefreshButton onRefreshClicked={this.handleRefresh} />
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

class RefreshButton extends React.Component {
   constructor() {
      super()
   }

   handleClick = () => {
      this.props.onRefreshClicked();
   }

   render() {
      return (
         <button 
            name="refresh"
            onClick={this.handleClick}   
         >
            <i className="fas fa-sync-alt" />
         </button>
      )
   }
}
