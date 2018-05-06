import React from 'react';

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         searchBoxInput: ''
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
      this.highlightText = this.highlightText.bind(this);
      this.handleSumbitLocation = this.handleSumbitLocation.bind(this);
      this.handleSubmitGeolocation = this.handleSubmitGeolocation.bind(this);
   }

   highlightText(event) {
      event.target.select();
   }

   handleChange(event) {
      this.setState({
         searchBoxInput: event.target.value
      })
   }

   handleKeyPress(event) {
      if (event.key === "Enter") {
         this.props.locateCall(this.state.searchBoxInput);
      }
   }

   handleSumbitLocation() {
      this.props.locateCall(this.state.searchBoxInput);
   }

   handleSubmitGeolocation() {
      this.props.geoCall();
   }

   render() {
      return (
         <div className="controls">
            <button name="locater" onClick={this.handleSubmitGeolocation}>
               <i className="fas fa-location-arrow"></i>
            </button>
            
            {/* // TODO: add google searchbox */}
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

            <button name="submit-location" onClick={this.handleSumbitLocation}><i className="fas fa-chevron-right"></i></button>
         </div>
      )
   }
}