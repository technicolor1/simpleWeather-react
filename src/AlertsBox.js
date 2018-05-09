import React from 'react';
import './style/AlertsBox.css';
const Moment = window.moment;

export class AlertsBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         displayAlerts: false
      }

      this.handleDesc = this.handleDesc.bind(this);
   }


   handleDesc(event) {
      // rotate chevron 
      if (this.state.displayAlerts === false) {
         this.setState({
            displayAlerts: true
         })
      } else {
         this.setState({
            displayAlerts: false
         })
      }
   }

   handleColorSeverity(severity) {
      switch (severity) {
         case "advisory":
            return {
               color: '#444',
               backgroundColor: '#ffeb3b'
            };

         case "watch":
            return {
               color: '#444',
               backgroundColor: '#ffeb3b'
            };

         case "warning":
            return {
               color: 'whitesmoke',
               backgroundColor: "#f44336"
            };

         default:
            return null;
      }
   }

   componentWillUpdate() {
      // hide all alerts at updates
      if (this.state.displayAlerts === "flex") {
         this.setState({
            displayAlerts: false
         })
      }
   }

   handleAlerts(alerts) {
      let id = 0;

      let alertsArr = alerts.map(alert =>
         <div key={`alert-${id++}`}
            style={this.handleColorSeverity(alert.severity)}
            className="alert">
            <h3>{alert.title} · Until {Moment.unix(alert.expires).format("dddd h:hh a")}</h3>
            <p 
            style={{ margin: "1em" }}
            >{alert.description}
            <br />
            <br />
               <a target="_blank" href={alert.uri}>More information</a>
            </p>
         </div>
      );

      return alertsArr;
   }

   render() {
      const {
         alertData
      } = this.props;

      if (typeof alertData === 'undefined') {
         return null;
      } else {
         return (
            <div className="alerts">
               <div id="infobox">
                  <span><i className="fas fa-exclamation-triangle"></i></span>
                  <h3>
                     There are warnings or advisories in your area
                  </h3>
                  <span
                     className={this.state.displayAlerts === true ? "rotateChevron" : null}
                     onClick={this.handleDesc}
                  >
                     <i className="fas fa-chevron-down" />
                  </span>
               </div>
               <div
                  id="collapsed-alerts"
                  style={this.state.displayAlerts ? { display: "flex" } : { display: "none" }}
               >
                  {this.handleAlerts(alertData)}
               </div>
            </div>
         )
      }
   }
}
