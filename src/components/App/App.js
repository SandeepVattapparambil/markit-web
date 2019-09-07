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
    this.googleMapScript.src = googleMapConfig.url
      .replace(/:key/, googleMapConfig.api_key)
      .replace(/:libraries/, googleMapConfig.libraries);
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
      zoom: googleMapConfig.map.defaultZoomLevel,
      center: {
        lat: googleMapConfig.map.defaultLocation.lat,
        lng: googleMapConfig.map.defaultLocation.lng
      },
      disableDefaultUI: googleMapConfig.map.disableDefaultUI
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
      .catch(error => {
        window.M.toast({ html: "Search failed, try again" });
      });
  };

  _getMarkers = () => {
    let url =
      URL_SCHEMA.root_url.replace(/:port/, URL_SCHEMA.server_port) +
      URL_SCHEMA.markitUrl.markers;
    this.ajax
      .fetchUrl(url, "GET")
      .then(response => {
        this._addMarkersToMapData(response.markers);
      })
      .catch(error => {
        window.M.toast({ html: "Failed to load markers" });
      });
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
        .catch(error => {
          window.M.toast({ html: "Failed to delete marker" });
        });
    }
  };

  _editMarker = query => {
    this.setState({
      searchQuery: query
    });
  };

  _editLocationMarker = markerId => {
    if (markerId) {
      let url =
        URL_SCHEMA.root_url.replace(/:port/, URL_SCHEMA.server_port) +
        URL_SCHEMA.markitUrl.markers +
        markerId;
      this.ajax
        .fetchUrl(url, "PUT", {}, { payload: this.state.searchQuery })
        .then(response => {
          window.M.toast({ html: "Marker updated" });
          this.removeMarker();
        })
        .catch(error => {
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
          </Row>
        </Container>
      </>
    );
  }
}

export default App;
