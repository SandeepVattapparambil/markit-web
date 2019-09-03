import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.googleMapRef = React.createRef();
  }

  componentDidMount() {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDEkGijSUn59Urd96tftpKsizYGqkUaMFQ&libraries=places`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener("load", () => {
      this.googleMap = this.createGoogleMap();
      this.marker = this.createMarker();
    });
  }

  createGoogleMap = () => {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 14,
      center: {
        lat: 43.642567,
        lng: -79.387054
      },
      disableDefaultUI: true
    });
  };

  createMarker = () => {
    return new window.google.maps.Marker({
      position: { lat: 43.642567, lng: -79.387054 },
      map: this.googleMap
    });
  };

  render() {
    return (
      <>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper white">
              <a href="#!" className="brand-logo grey-text">
                &nbsp; MarkIt
              </a>
            </div>
          </nav>
        </div>
        <div className="container">
          <div className="row">
            <div className="col s12 m12">
              <div className="card-panel blue">
                <span className="white-text">
                  I am a very simple card. I am good at containing small bits of
                  information. I am convenient because I require little markup
                  to use effectively. I am similar to what is called a panel in
                  other frameworks.
                </span>
              </div>
            </div>

            <div className="col s12 m6">
              <div
                ref={this.googleMapRef}
                id="google-map"
                className="card-panel white map-holder"
              ></div>
            </div>

            <div className="col s12 m6">
              <div className="card">
                <div className="card-content grey-text">
                  <span className="card-title">Add Marker</span>
                  <div className="row">
                    <div className="input-field col s9">
                      <input
                        placeholder="Enter your location"
                        id="location"
                        type="text"
                        className="validate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
