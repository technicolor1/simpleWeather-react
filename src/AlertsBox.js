import React from 'react';
import './AlertsBox.css';
const Moment = window.moment;

export class AlertsBox extends React.Component {
   constructor(props) {
      super(props)
      this.state = {
         displayDiv: "none"
      }

      this.handleDesc = this.handleDesc.bind(this);
   }

   handleDesc(event) {
      if (this.state.displayDiv === "none") {
         this.setState({
            displayDiv: "block"
         })
      } else {
         this.setState({
            displayDiv: "none"
         })
      }
   }

   render() {
      if (this.props.alertData === '' || typeof this.props.alertData === 'undefined') {
         return (
            <div>
               No warnings or advisories at this time
            </div>
         )
      } else {
         return (
            <div className="alerts">
               <h3>{this.props.alertData[0].title} <span onClick={this.handleDesc}><i className="fas fa-chevron-down"></i></span></h3>
               <div style={{ display: this.state.displayDiv }}>
                  <p>{this.props.alertData[0].description}</p>
                  <h4>EXPIRES {Moment.unix(this.props.alertData[0].expires).format("h:hh a")}</h4>
               </div>

            </div>
         )
      }
   }
}