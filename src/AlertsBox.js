import React from 'react';
import './style/AlertsBox.css';

const Moment = window.moment;

export class AlertsBox extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         displayAlerts: false
      }

      this.handleClick = this.handleClick.bind(this);
   }


   handleClick(event) {
      this.setState(prevState => ({
         displayAlerts: !prevState.displayAlerts
      }))
   }

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
               <div
                  onClick={this.handleClick}
                  id="infobox"
               >
                  <span><i className="fas fa-exclamation-triangle"></i></span>
                  <h3>
                     There are warnings or advisories in your area
                  </h3>
                  <span
                     className={this.state.displayAlerts === true ? "rotateChevron" : null}
                  >
                     <i className="fas fa-chevron-down" />
                  </span>
               </div>

               <AlertsCells onAlertCellClick={this.handleModal} alertData={alertData} displayAlerts={this.state.displayAlerts} />
            </div>
         )
      }
   }
}

class AlertsCells extends React.Component {
   constructor() {
      super()

      this.state = {
         isModalOpen: false,
         alertIndex: 0
      }

      this.handleAlertCellClick = this.handleAlertCellClick.bind(this);
      this.handleClickOutsideModal = this.handleClickOutsideModal.bind(this);
   }

   componentWillReceiveProps() {
      this.setState({
         alertIndex: 0
      })
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

   handleAlertCellClick(e) {
      this.setState({
         isModalOpen: true,
         alertIndex: e.currentTarget.getAttribute("data-index")
      })

      // overflow hidden at body
      document.querySelector("body").classList.toggle("modalOpen");
   }

   handleClickOutsideModal() {
      this.setState({
         isModalOpen: false
      })

      document.querySelector("body").classList.toggle("modalOpen");
   }

   handleAlerts(alerts) {
      let id = 0;
      let alertsArr = [];

      alerts.forEach(alert => {
         alertsArr.push(
            <div key={`alert-${id}`}
               style={this.handleColorSeverity(alert.severity)}
               onClick={this.handleAlertCellClick}
               className="alert"
               data-index={id}
            >
               <h3>{alert.title} · Until {Moment.unix(alert.expires).format("dddd h:hh a")}</h3>
            </div>
         )
         id++;
      })

      return alertsArr;
   }

   render() {
      return (
         <div
            id="collapsed-alerts"
            style={this.props.displayAlerts ? { display: "flex" } : { display: "none" }}
         >
            {this.handleAlerts(this.props.alertData)}

            <AlertsModal
               onOutsideClick={this.handleClickOutsideModal}
               triggerModal={this.state.isModalOpen}
               alertIndex={this.state.alertIndex}
               alertData={this.props.alertData}
            />
         </div>
      )
   }
}


class AlertsModal extends React.Component {
   constructor() {
      super()

   }

   // modal trigger https://stackoverflow.com/a/42234988

   componentWillReceiveProps(nextProps) {
      if (nextProps.triggerModal) {
         document.addEventListener('mousedown', this.handleClickOutside);
      } else {
         document.removeEventListener('mousedown', this.handleClickOutside);
      }
   }

   componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside);
   }

   setWrapperRef = (node) => {
      this.wrapperRef = node;
   }

   handleClickOutside = (e) => {
      if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
         console.log("Clicked outside!");
         // hide the modal
         this.props.onOutsideClick();
      }
   }

   render() {
      if (typeof this.props.alertData === "undefined") {
         return null;
      }
      return (
         <div
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
            } : {
                  display: "none"
               }}
            className="alert-modal"
         >
            <div className="modal-content"
               ref={this.setWrapperRef}
               style={{
                  margin: "auto",
                  padding: "20px",
                  width: "80%",
                  background: "#fefefe"
               }}
            >
               {/* <p>Now this is pod racing!</p> */}
               <h3>{this.props.alertData[parseInt(this.props.alertIndex)].title} · Until {Moment.unix(this.props.alertData[parseInt(this.props.alertIndex)].expires).format("dddd h:hh a")}</h3>               
               <p>{this.props.alertData[parseInt(this.props.alertIndex)].description}</p>
               <p><a target="_blank" href={this.props.alertData[parseInt(this.props.alertIndex)].uri}>More information</a></p>
            </div>
         </div>
      )
   }
}
