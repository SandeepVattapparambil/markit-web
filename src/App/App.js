import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchButtonDisabled: true,
      editButtonDisabled: true,
      editFormVisible: false,
      searchQuery: "",
      markerDataArray: []
    };

    this.googleMap = "";
    this.marker = "";
    this.markerArray = [];
    this.googleMapRef = React.createRef();
    this.inputRef = React.createRef();
    this.editMarkerRef = React.createRef();
    this.googleMapScript = document.createElement("script");
  }

  componentDidMount() {
    this.googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAyphEg6Ezze8PuQwfcVAn9e8S56BlEQM8&libraries=places`;
    window.document.body.appendChild(this.googleMapScript);
    this.googleMapScript.addEventListener("load", () => {
      this.googleMap = this.createGoogleMap();
      this.marker = this.createMarker(this.googleMap);
    });
    this._getMarkers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.markerDataArray !== prevState.markerDataArray) {
      if (window.google) {
        this.marker = this.createMarker(this.googleMap);
      }
    }
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

  createMarker = map => {
    this.state.markerDataArray.map(marker => {
      let mark = new window.google.maps.Marker({
        position: {
          lat: marker.location_coordinates.lat,
          lng: marker.location_coordinates.lng
        },
        title: marker.formatted_address,
        map: map
      });
      this.markerArray.push(mark);
      return mark;
    });
  };

  removeMarker = () => {
    for (let i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(null);
    }
    this._getMarkers();
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
      .get(`http://localhost:3001/search/${this.state.searchQuery}`)
      .then(response => {
        window.M.toast({ html: response.data.message });
        this._getMarkers();
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  _getMarkers = () => {
    axios
      .get(`http://localhost:3001/markers`)
      .then(response => {
        this._addMarkersToMapData(response.data.markers);
        this.inputRef.current.value = "";
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {});
  };

  _addMarkersToMapData = markerData => {
    if (markerData) {
      this.setState({
        markerDataArray: markerData
      });
    }
  };

  _deleteMarker = id => {
    if (id) {
      axios
        .delete(`http://localhost:3001/markers/${id}`)
        .then(response => {
          window.M.toast({ html: "Marker deleted" });
          this.removeMarker();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    }
  };

  _editMarker = query => {
    this.setState({
      searchQuery: query
    });
    if (query && query.length > 1) {
      this.setState({
        editButtonDisabled: false
      });
    } else {
      this.setState({
        editButtonDisabled: true
      });
    }
  };

  _enableEditMode = () => {
    this.setState({
      editFormVisible: !this.state.editFormVisible
    });
  };

  _editLocationMarker = markerId => {
    if (markerId) {
      axios
        .put(`http://localhost:3001/markers/${markerId}`, {
          payload: this.state.searchQuery
        })
        .then(response => {
          window.M.toast({ html: "Marker updated" });
          this.editMarkerRef.current.value = "";
          this.removeMarker();
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
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
                        ref={this.inputRef}
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
                      <div className="chip blue lighten-2">
                        Lattitude: {marker.location_coordinates.lat}
                      </div>
                      <div className="chip blue lighten-3">
                        Longitude: {marker.location_coordinates.lng}
                      </div>
                    </div>
                    <div
                      className={`card-content grey-text ${
                        this.state.editFormVisible ? "" : "hide"
                      }`}
                    >
                      <div className="row">
                        <div className="input-field col s10">
                          <input
                            ref={this.editMarkerRef}
                            id="location_to_edit"
                            type="text"
                            className="validate"
                            onChange={e =>
                              this._editMarker(e.currentTarget.value)
                            }
                          />
                        </div>
                        <div className="col s2">
                          <button
                            className={`waves-effect waves-light blue btn ${
                              this.state.editButtonDisabled ? "disabled" : ""
                            }`}
                            onClick={e => this._editLocationMarker(marker.id)}
                          >
                            <i className="material-icons">edit</i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="card-action">
                      <button
                        className="waves-effect btn-flat blue-text"
                        onClick={this._enableEditMode}
                      >
                        Edit
                      </button>
                      <button
                        className="waves-effect btn-flat red-text"
                        onClick={e => {
                          e.preventDefault();
                          this._deleteMarker(marker.id);
                        }}
                      >
                        Delete
                      </button>
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
