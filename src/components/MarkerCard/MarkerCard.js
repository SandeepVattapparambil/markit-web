import React, { Component } from "react";

import "./style.css";

import Row from "../common/Row/Row";

class MarkerCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editButtonDisabled: true,
      editFormVisible: false,
      markerLabel: this.props.markerData.formatted_address
    };
    this.editMarkerRef = React.createRef();
  }

  _deleteMarker = id => {
    this.props.passMarkerId(id);
  };

  _editMarker = query => {
    this.setState({
      markerLabel: query
    });
    this.props.passSearchQuery(query);
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
    this.props.passLocationMarkerIdToEdit(markerId);
    this.editMarkerRef.current.value = "";
    this.setState({
      editButtonDisabled: true,
      editFormVisible: !this.state.editFormVisible
    });
  };

  render() {
    return (
      <div className="col s12">
        <div className="card">
          <div className="card-content grey-text">
            <span className="card-title blue-text">
              <i className="material-icons left">room</i>
              {this.props.markerData.formatted_address}
            </span>
            <div className="chip blue lighten-2">
              Lattitude: {this.props.markerData.location_coordinates.lat}
            </div>
            <div className="chip blue lighten-3">
              Longitude: {this.props.markerData.location_coordinates.lng}
            </div>
          </div>
          <div
            className={`card-content grey-text ${
              this.state.editFormVisible ? "" : "hide"
            }`}
          >
            <Row>
              <div className="input-field col s10">
                <input
                  ref={this.editMarkerRef}
                  id="location_to_edit"
                  type="text"
                  className="validate"
                  value={this.state.markerLabel}
                  onChange={e => this._editMarker(e.currentTarget.value)}
                />
              </div>
              <div className="col s2">
                <button
                  className={`waves-effect waves-light blue btn edit-btn ${
                    this.state.editButtonDisabled ? "disabled" : ""
                  }`}
                  onClick={e =>
                    this._editLocationMarker(this.props.markerData.id)
                  }
                >
                  <i className="material-icons">edit</i>
                </button>
              </div>
            </Row>
          </div>
          <div className="card-action">
            <button
              className="waves-effect btn-flat blue-text"
              title="toggle edit mode"
              onClick={this._enableEditMode}
            >
              Edit
            </button>
            <button
              className="waves-effect btn-flat red-text"
              onClick={e => {
                e.preventDefault();
                this._deleteMarker(this.props.markerData.id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MarkerCard;
