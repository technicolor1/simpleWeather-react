import React from 'react';
import {keys} from './config/config.js';

export class SearchBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         value: ''
      }
   }

   render() {
      return (
         <div className="controls">
            <button name="locater">
               <i className="fas fa-location-arrow"></i>
            </button>
            <input onChange={this.handleChange} id="pac-input" className="controls" type="text" placeholder="Search Box" autoFocus="autofocus" />
            <button name="submit-location" onClick={this.searchLocate}><i className="fas fa-chevron-right"></i></button>
         </div>
      )
   }
}

export default SearchBox;