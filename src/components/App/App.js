/**
 * Import React
 */
import React, { Component } from "react";

/**
 * Import services and configurations
 */
import Ajax from "../../services/ajax";
import * as URL_SCHEMA from "../../config/urlSchema.json";
import * as googleMapConfig from "../../config/googleMapsConfig.json";

/**
 * Impot stylesheets
 */
import "./App.css";

/**
 * Import sub components
 */
import Navbar from "../common/Navbar/Navbar";
import Container from "../common/Container/Container";
import Row from "../common/Row/Row";
import MessageCard from "../common/MessageCard/MessageCard";
import MarkerCard from "../MarkerCard/MarkerCard";
import AddMarker from "../AddMarker/AddMarker";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchButtonDisabled: true,
      searchQuery: "",
      markerDataArray: []
    };
    this.googleMap = "";
    this.marker = "";
    this.markerArray = [];
    this.googleMapRef = React.createRef();
    this.googleMapScript = document.createElement("script");
    this.ajax = new Ajax();
  }

  componentDidMount() {
    this._initMaps();
    this._getMarkers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.markerDataArray !== prevState.markerDataArray) {
      if (window.google) {
        this.marker = this.createMarker(this.googleMap);
      }
    }
  }

  /**
   * @function _initMaps
   * A helper function to initialize the Maps service
   */
  _initMaps = () => {
    this.googleMapScript.src = googleMapConfig.url
      .replace(/:key/, googleMapConfig.api_key)
      .replace(/:libraries/, googleMapConfig.libraries);
    window.document.body.appendChild(this.googleMapScript);
    this.googleMapScript.addEventListener("load", () => {
      this.googleMap = this.createGoogleMap();
      this.marker = this.createMarker(this.googleMap);
    });
  };

  /**
   * @function createGoogleMap
   * A helper function to create a google map using the initialized service
   * and DOM object accessed using the react ref
   * @returns {Object} - google maps object
   */
  createGoogleMap = () => {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: googleMapConfig.map.defaultZoomLevel,
      center: {
        lat: googleMapConfig.map.defaultLocation.lat,
        lng: googleMapConfig.map.defaultLocation.lng
      },
      disableDefaultUI: googleMapConfig.map.disableDefaultUI
    });
  };

  /**
   * @function createMarker
   * A helper function create a marker on a google map
   * This function creates markers on map using data from state
   * @param {Object} map - The created map object returned from createGoogleMap() function
   */
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
      return this.markerArray.push(mark);
    });
  };

  /**
   * @function removeMarker
   * A helper function to reset a map and then set the map back again
   */
  removeMarker = () => {
    for (let i = 0; i < this.markerArray.length; i++) {
      this.markerArray[i].setMap(null);
    }
    this._getMarkers();
  };

  /**
   * @function _getSearchQuery
   * A helper function to get the search query from AddMarker component
   * @param {String} query - The search query (address)
   */
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

  /**
   * @function _searchLocation
   * A helper function to search for a given address using the search api
   */
  _searchLocation = () => {
    let url =
      URL_SCHEMA.root_url.replace(/:port/, URL_SCHEMA.server_port) +
      URL_SCHEMA.markitUrl.search.replace(/:id/, this.state.searchQuery);
    this.ajax
      .fetchUrl(url, "GET")
      .then(response => {
        window.M.toast({ html: response.message });
        this._getMarkers();
      })
      .catch(() => {
        window.M.toast({ html: "Search failed, try again" });
      });
  };

  /**
   * @function _getMarkers
   * A helper function to get a list of markers from api
   */
  _getMarkers = () => {
    let url =
      URL_SCHEMA.root_url.replace(/:port/, URL_SCHEMA.server_port) +
      URL_SCHEMA.markitUrl.markers;
    this.ajax
      .fetchUrl(url, "GET")
      .then(response => {
        this._addMarkersToMapData(response.markers);
      })
      .catch(() => {
        window.M.toast({ html: "Failed to load markers" });
      });
  };

  /**
   * @function _addMarkersToMapData
   * A helper to add a marker to map data set
   * @param {Object} markerData  -The marker data obtained from api
   */
  _addMarkersToMapData = markerData => {
    if (markerData) {
      this.setState({
        markerDataArray: markerData
      });
    }
  };

  /**
   * @function _deleteMarker
   * A helper to delete a marker from marker data set
   * @param {Number} id - The id of the marker
   */
  _deleteMarker = id => {
    if (id) {
      let url =
        URL_SCHEMA.root_url.replace(/:port/, URL_SCHEMA.server_port) +
        URL_SCHEMA.markitUrl.markers +
        id;
      this.ajax
        .fetchUrl(url, "DELETE")
        .then(() => {
          window.M.toast({ html: "Marker deleted" });
          this.removeMarker();
        })
        .catch(() => {
          window.M.toast({ html: "Failed to delete marker" });
        });
    }
  };

  /**
   * @function _editMarker
   * A helper function to store search query on to the state
   * @param {String} query - The search query string
   */
  _editMarker = query => {
    this.setState({
      searchQuery: query
    });
  };

  /**
   * @function _editLocationMarker
   * A helper function edit a specific marker by sending the new address
   * to the api with the id of the marker
   * @param {Number} markerId - The id of the marker to be edited
   */
  _editLocationMarker = markerId => {
    if (markerId) {
      let url =
        URL_SCHEMA.root_url.replace(/:port/, URL_SCHEMA.server_port) +
        URL_SCHEMA.markitUrl.markers +
        markerId;
      this.ajax
        .fetchUrl(url, "PUT", {}, { payload: this.state.searchQuery })
        .then(() => {
          window.M.toast({ html: "Marker updated" });
          this.removeMarker();
        })
        .catch(() => {
          window.M.toast({ html: "Failed to edit marker" });
        });
    }
  };

  render() {
    return (
      <>
        <Navbar />
        <Container>
          <Row>
            <MessageCard />
            <div className="col s12 m6">
              <div
                ref={this.googleMapRef}
                id="google-map"
                className="card-panel white map-holder"
              ></div>
            </div>
            <div className="col s12 m6">
              <AddMarker
                triggerSearch={this._searchLocation}
                passSearchQuery={this._getSearchQuery}
              />
              {this.state.markerDataArray.map((marker, key) => {
                return (
                  <MarkerCard
                    key={key}
                    markerData={marker}
                    passMarkerId={this._deleteMarker}
                    passSearchQuery={this._editMarker}
                    passLocationMarkerIdToEdit={this._editLocationMarker}
                  />
                );
              })}
            </div>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
