import React from 'react';
import './SearchBox.css';

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         searchBoxInput: ''
      }

      this.handleChange = this.handleChange.bind(this);
   }

   handleChange(event) {
      this.setState({
         searchBoxInput: event.target.value
      })
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
               id="pac-input"
               className="controls"
               type="text"
               placeholder="City, Zip, Locale"
            />

            <button name="submit-location" onClick={() => { this.props.locateCall(this.state.searchBoxInput) }}><i className="fas fa-chevron-right"></i></button>
         </div>
      )
   }
}