import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchButtonDisabled: true,
      searchQuery: "",
      markerDataArray: []
    };
    this.googleMapRef = React.createRef();
  }

  componentDidMount() {
    const googleMapScript = document.createElement("script");
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAyphEg6Ezze8PuQwfcVAn9e8S56BlEQM8&libraries=places`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener("load", () => {
      this.googleMap = this.createGoogleMap();
      this.marker = this.createMarker();
    });
  }

  createGoogleMap = () => {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 11,
      center: {
        lat: 52.520008,
        lng: 13.404954
      },
      disableDefaultUI: true
    });
  };

  createMarker = () => {
    return new window.google.maps.Marker({
      position: { lat: 52.520008, lng: 13.404954 },
      map: this.googleMap
    });
  };

  _getSearchQuery = query => {
    this.setState({
      searchQuery: query
    });
    if (query && query.length > 1) {
      this.setState({
        searchButtonDisabled: false
      });
    } else {
      this.setState({
        searchButtonDisabled: true
      });
    }
  };

  _searchLocation = event => {
    event.preventDefault();
    axios
      .get(`http://localhost:3001/autoComplete/${this.state.searchQuery}`)
      .then(response => {
        this._addMarkerToMapData(
          this.state.markerDataArray,
          response.data.markerData
        );
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  _addMarkerToMapData = (array, markerData) => {
    if (Object.keys(markerData).length) {
      const index = array.findIndex(event => event.id === markerData.id);
      if (index === -1) {
        array.push(markerData);
        window.M.toast({ html: "Location added" });
      } else {
        array[index] = markerData;
        window.M.toast({ html: "Location exists !" });
      }
      this.setState({
        markerDataArray: array
      });
    } else {
      window.M.toast({ html: "Location not found !" });
    }
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
                  <strong>Hello..</strong>, welcome to MarkIt, this is a simple
                  app which demonstrates the integration of google maps static
                  api and geocoding api. You can add markers on the below map
                  using this app.
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
                  <span className="card-title">
                    <i className="material-icons left">room</i>Add Marker
                  </span>
                  <div className="row">
                    <div className="input-field col s10">
                      <input
                        id="location"
                        type="text"
                        className="validate"
                        onChange={e =>
                          this._getSearchQuery(e.currentTarget.value)
                        }
                      />
                      <label htmlFor="location">Enter location here..</label>
                    </div>
                    <div className="col s2">
                      <a
                        href="!#"
                        className={`waves-effect waves-light blue btn ${
                          this.state.searchButtonDisabled ? "disabled" : ""
                        }`}
                        onClick={e => this._searchLocation(e)}
                      >
                        <i className="material-icons">search</i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {this.state.markerDataArray.map((marker, key) => {
              return (
                <div key={key} className="col s12 m6">
                  <div className="card">
                    <div className="card-content grey-text">
                      <span className="card-title blue-text">
                        <i className="material-icons left">room</i>
                        {marker.formatted_address}
                      </span>
                      <div className="chip">Lattitude: {marker.location_coordinates.lat}</div>
                      <div className="chip">Longitude: {marker.location_coordinates.lng}</div>
                    </div>
                    <div className="card-action">
                    <a className="waves-effect btn-flat grey-text">Edit</a>
                    <a className="waves-effect btn-flat grey-text">Delete</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default App;
