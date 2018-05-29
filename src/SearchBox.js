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
            <RefreshButton onRefreshClicked={this.handleRefresh} />
            <InputField
               onAutocompletePlaceChanged={this.handleAutocompletePlaceChanged}
            />
         </div>
      )
   }
}

class ClearButton extends React.Component {
   constructor() {
      super() 

      this.handleClick = this.handleClick.bind(this);
   }

   handleClick() {
      this.props.onClearClicked();
   }

   render() {
      return (
         <button 
            name="clear"
            title="clear input"
            onClick={this.handleClick}
            style={{
               background: "inherit",
               border: "0",
               color: "#444"
            }}
         >
            <i className="fas fa-times"></i>
         </button>
      )
   }
}

class InputField extends React.Component {
   constructor() {
      super()

      this.googlebox = null;

      this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
      this.handleClearClicked = this.handleClearClicked.bind(this);
      this.inputFieldRef = React.createRef();
   }

   handlePlaceChanged() {
      // getplace
      let place = this.googlebox.getPlace();
      let googledata = {
         location: place.formatted_address,
         lat: place.geometry.location.lat(),
         long: place.geometry.location.lng()
      }
      this.props.onAutocompletePlaceChanged(googledata);
   }

   // attach google autocomplete
   componentDidMount() {
      // set autocomplete to only regions
      let options = {
         types: ['(regions)']
      };

      // for some reason google does not like react refs ¯\_(ツ)_/¯
      let input = document.querySelector("#pac-input");
      // autocomplete
      let searchBox = new Google.maps.places.Autocomplete(input, options);
      this.googlebox = searchBox;
      // eventlistener
      searchBox.addListener("place_changed", this.handlePlaceChanged);
   }

   handleClearClicked() {
      this.inputFieldRef.current.value = "";
   }

   render() {
      return (
         <React.Fragment>
         <input
            ref={this.inputFieldRef}
            autoFocus
            onFocus={this.highlightText}
            id="pac-input"
            className="searchbox"
            type="text"
            placeholder="City, Zip, Locale"
         />
         <ClearButton onClearClicked={this.handleClearClicked}/>
         </React.Fragment>
      )
   }
}

class RefreshButton extends React.Component {
   constructor() {
      super()

      this.handleClick = this.handleClick.bind(this);
   }

   handleClick() {
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
