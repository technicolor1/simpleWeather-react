import React from 'react';
import './style/AlertsBox.css';
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
               color: '#444',
               backgroundColor: '#ffeb3b',
               display: this.state.displayDiv
            };

         case "watch":
            return {
               color: '#444',
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

      let alertsArr = alerts.map(alert =>
         <div key={id++}
            style={this.handleColorSeverity(alert.severity)}
            className="alert">
            <h3>{alert.title} · Until {Moment.unix(alert.expires).format("dddd h:hh a")}</h3>
         </div>
      );

      return alertsArr;
   }

   render() {
      if (this.props.alertData === '' || typeof this.props.alertData === 'undefined') {
         return <div></div>;
      } else {
         return (
            <div className="alerts">
               <div id="infobox">
                  <span><i className="fas fa-exclamation-triangle"></i></span>
                  <h3>
                     There are warnings or advisories in your area
                  </h3>
                  <span onClick={this.handleDesc}><i className="fas fa-chevron-down"></i></span>
               </div>
               <div id="collapsed-alerts">
                  {this.handleAlerts(this.props.alertData)}
               </div>
            </div>
         )
      }
   }
}