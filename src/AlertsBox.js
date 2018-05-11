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

   // handleColorSeverity(severity) {
   //    switch (severity) {
   //       case "advisory":
   //          return {
   //             color: '#444',
   //             backgroundColor: '#ffeb3b'
   //          };

   //       case "watch":
   //          return {
   //             color: '#444',
   //             backgroundColor: '#ffeb3b'
   //          };

   //       case "warning":
   //          return {
   //             color: 'whitesmoke',
   //             backgroundColor: "#f44336"
   //          };

   //       default:
   //          return null;
   //    }
   // }

   // handleAlerts(alerts) {
   //    let id = 0;

   //    let alertsArr = alerts.map(alert =>
   //       <div key={`alert-${id++}`}
   //          style={this.handleColorSeverity(alert.severity)}
   //          className="alert"
   //       >
   //          <h3>{alert.title} · Until {Moment.unix(alert.expires).format("dddd h:hh a")}</h3>
   //          <p 
   //          style={{ margin: "1em" }}
   //          >{alert.description}
   //          <br />
   //          <br />
   //             <a target="_blank" href={alert.uri}>More information</a>
   //          </p>
   //       </div>
   //    );

   //    return alertsArr;
   // }

   componentWillUpdate() {
      // hide all alerts at updates
      if (this.state.displayAlerts === "flex") {
         this.setState({
            displayAlerts: false
         })
      }
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
               
               <AlertsCells onAlertCellClick={this.handleModal} alertData={alertData} displayAlerts={this.state.displayAlerts}/>
            </div>
         )
      }
   }
}

class AlertsCells extends React.Component {
   constructor() {
      super()

      this.state = {
         isModalOpen: false
      }
      
      this.handleAlertCellClick = this.handleAlertCellClick.bind(this);
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

   // pass message to parent 
   handleAlertCellClick() {
      this.setState(prevState => ({
         isModalOpen: !prevState.isModalOpen
      }));

      document.querySelector("body").classList.toggle("modalOpen");
   }

   handleAlerts(alerts) {
      let id = 0;

      let alertsArr = alerts.map(alert =>
         <div key={`alert-${id++}`}
            style={this.handleColorSeverity(alert.severity)}
            onClick={this.handleAlertCellClick}
            className="alert"
         >
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
      return (
      <div
         id="collapsed-alerts"
         style={this.props.displayAlerts ? { display: "flex" } : { display: "none" }}
      >
         {this.handleAlerts(this.props.alertData)}

         <AlertsModal triggerModal={this.state.isModalOpen}/>
      </div>
      )
   }
}

// trigger modal when alert cell clicked
class AlertsModal extends React.Component {
   constructor() {
      super()

      this.handleClick = this.handleClick.bind(this);
      this.handleOutsideClick = this.handleOutsideClick.bind(this);
   }

   handleClick() {
      if (!this.props.triggerModal) {
         document.addEventListener("mousedown", this.handleOutsideClick, false);
         console.log("added eventlistener");         
      } else {
         document.removeEventListener("mousedown", this.handleOutsideClick, false);    
         console.log("Clicked outside");
      }
   }

   handleOutsideClick(event) {
      if (!this.node.contains(event.target)) {
         this.handleClick();
      }
   }

   render() {
      return (
         <div
            onClick={this.handleClick}
            ref={node => this.node = node}
            style={this.props.triggerModal ? { 
               position: "fixed",
               display: "flex",
               zIndex: "1",
               top: "0",
               left: "0",
               right: "0",
               bottom: "0",
               width: "100%",
               height: "100%",
               background: "rgba(0,0,0,0.4)"
            } : null} 
            className="alert-modal"
         >
            <div className="modal-content" 
            style={{
               margin: "auto",
               padding: "20px",
               width: "80%",
               background: "#fefefe"
            }}
            >
               <p>Now this is pod racing!</p>
            </div>
         </div>
      )
   }
}