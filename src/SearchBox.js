import React from 'react';
import './SearchBox.css';

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         searchBoxInput: ''
      }

      this.handleChange = this.handleChange.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
   }

   handleChange(event) {
      this.setState({
         searchBoxInput: event.target.value
      })
   }

   handleKeyPress(event) {
      console.log(event.key === "Enter");

      if (event.key === "Enter") {
         this.props.locateCall(this.state.searchBoxInput);
      }
   }

   render() {
      return (
         <div className="controls">
            <button name="locater" onClick={() => { this.props.geoCall() }}>
               <i className="fas fa-location-arrow"></i>
            </button>
            {/* Remove this near production */}
            <button name="tester" onClick={() => { this.props.testerCall() }}>Test</button>            

            {/* // TODO: add google searchbox */}
            <input
               autoFocus
               onChange={this.handleChange}
               onKeyPress={this.handleKeyPress}
               id="pac-input"
               className="searchbox"
               type="text"
               placeholder="City, Zip, Locale"
            />

            <button name="submit-location" onClick={() => { this.props.locateCall(this.state.searchBoxInput) }}><i className="fas fa-chevron-right"></i></button>
         </div>
      )
   }
}