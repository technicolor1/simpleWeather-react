import React from 'react';

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         searchBoxValue: ''
      }

      this.handleSearchBoxInputChange = this.handleSearchBoxInputChange.bind(this);
      this.handleGeoBtnClicked = this.handleGeoBtnClicked.bind(this);
      this.handleUserInputs = this.handleUserInputs.bind(this);
   }

   validateSearchboxInput() {    
      if (this.state.searchBoxValue === "") {
         return false;
      }

      return true;
   }
   
   handleUserInputs() {
      if (!this.validateSearchboxInput()) { return; }

      let uri = `json?address=${this.state.searchBoxValue}`;
      
      this.props.fetchLocation(uri);
   }
   
   handleSearchBoxInputChange(input) {
      this.setState({
         searchBoxValue: input
      })
   }
   
   // except for geoBtn, it doesn't need inputfield
   handleGeoBtnClicked(uri) {
      this.props.fetchLocation(uri);
   }

   render() {
      return (
         <div className="controls">
            <GeoButton onBtnClicked={this.handleGeoBtnClicked}/>            
            <InputField onSearchBoxInputChange={this.handleSearchBoxInputChange} onKeyPressed={this.handleUserInputs}/>            
            <LocateButton onBtnClicked={this.handleUserInputs}/>
         </div>
      )
   }
}

class InputField extends React.Component {
   constructor() {
      super() 

      this.handleChange = this.handleChange.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
   }

   handleChange(event) {
      this.props.onSearchBoxInputChange(event.target.value);
   }

   handleKeyPress(event) {
      if (event.key === "Enter") {

         this.props.onKeyPressed();
      }
   }

   render() {
      return (
         <input
            autoFocus
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
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

      this.handleClick = this.handleClick.bind(this);
   }

   handleClick() {
      
      this.props.onBtnClicked();
   }

   render() {
      return (
         <button name="submit-location" onClick={this.handleClick}>
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