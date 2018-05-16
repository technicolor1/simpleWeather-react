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
      // set to default
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
      document.querySelector("#root").classList.toggle("modalOpen");
   }

   handleClickOutsideModal() {
      this.setState({
         isModalOpen: false
      })

      document.querySelector("#root").classList.toggle("modalOpen");
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
               handleColorSeverity={this.handleColorSeverity}
            />
         </div>
      )
   }
}


class AlertsModal extends React.Component {
   constructor() {
      super()

      this.setWrapperRef = this.setWrapperRef.bind(this);
      this.handleClickOutside = this.handleClickOutside.bind(this);
   }

   // modal trigger https://stackoverflow.com/a/42234988

   componentWillReceiveProps(nextProps) {
      if (nextProps.triggerModal) {
         document.addEventListener('touchstart', this.handleClickOutside);
         document.addEventListener('mousedown', this.handleClickOutside);
      } else {
         document.removeEventListener('touchstart', this.handleClickOutside);
         document.removeEventListener('mousedown', this.handleClickOutside);
      }
   }

   componentWillUnmount() {
      document.removeEventListener('touchstart', this.handleClickOutside);
      document.removeEventListener('mousedown', this.handleClickOutside);
   }

   setWrapperRef(node) {
      this.wrapperRef = node;
   }

   handleClickOutside(e) {
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
      const {
         alertIndex,
         alertData
      } = this.props;

      const alertIndexToInt = alertData[parseInt(alertIndex)];

      return (
         <div
            style={{
               display: !this.props.triggerModal ? "none" : "flex"
            }}
            className="alert-modal"
         >
            <div className="modal-content"
               ref={this.setWrapperRef}
            >
               <div 
               style={this.props.handleColorSeverity(alertIndexToInt.severity)}
               className="modal-header"
               >
                  <h3>
                     {alertIndexToInt.title} · Until {Moment.unix(alertIndexToInt.expires).format("dddd h:hh a")}
                  </h3>
               </div>
               <div className="modal-body">
                  <p>
                     {alertIndexToInt.description}
                  </p>
               </div>
               <div className="modal-footer">
                  <p>
                     <a target="_blank" href={alertIndexToInt.uri}>More information</a>
                  </p>
               </div>
            </div>
         </div>
      )
   }
}
