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
            displayDiv: "flex"
         })
      } else {
         this.setState({
            displayDiv: "none"
         })
      }
   }
   
   handleColorSeverity(severity) {
      switch (severity) {
         case "advisory":
         return {
            color: '#6d6d6d',
            backgroundColor: '#ffeb3b',
            display: this.state.displayDiv
         };
         
         case "watch":
         return {
            color: '#6d6d6d',
            backgroundColor: '#ffeb3b',
            display: this.state.displayDiv
         };
         
         case "warning":
         return {
            color: 'whitesmoke',
            backgroundColor: "#f44336",
            display: this.state.displayDiv
         };
         
         default:
         return "red";
      }
   }

   componentWillUpdate() {
      if (this.state.displayDiv === "flex") {
         this.setState({
            displayDiv: "none"
         })
      }
   }
   
   handleAlerts(alerts) {
      let id = 0;
      let main = [];

      let alertsArr = alerts.map(alert => 
         <div key={id++}
         style={ this.handleColorSeverity(alert.severity) }
         className="alert">
            <h3>{alert.title} · Until {Moment.unix(alert.expires).format("dddd h:hh a")}</h3>
         </div>
      );

      return alertsArr;
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
               <h3>
                  <span><i className="fas fa-exclamation-triangle"></i></span>
                  There are warnings or advisories in your area 
                  <span onClick={this.handleDesc}><i className="fas fa-chevron-down"></i></span>
               </h3>
               <div 
               id="collapsed-alerts"
               style={{ display: this.state.displayDiv }}>
                  {this.handleAlerts(this.props.alertData)}                                 
               </div>
            </div>
         )
      }
   }
}