import React, { Component } from "react";

import './style.css';

import Row from "../common/Row/Row";

class AddMarker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchButtonDisabled: true,
      searchQuery: ""
    };
    this.inputRef = React.createRef();
  }

  _getSearchQuery = query => {
    this.props.passSearchQuery(query);
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
    this.props.triggerSearch();
    this.inputRef.current.value = "";
    this.setState({
      searchButtonDisabled: true
    });
  };

  render() {
    return (
      <div className="col s12">
        <div className="card">
          <div className="card-content grey-text">
            <span className="card-title">
              <i className="material-icons left">room</i>Add Marker
            </span>
            <Row>
              <div className="input-field col s10">
                <input
                  ref={this.inputRef}
                  id="location"
                  type="text"
                  className="validate"
                  onChange={e => this._getSearchQuery(e.currentTarget.value)}
                />
                <label htmlFor="location">Enter location here..</label>
              </div>
              <div className="col s2">
                <button
                  href="!#"
                  className={`waves-effect waves-light blue search-btn btn ${
                    this.state.searchButtonDisabled ? "disabled" : ""
                  }`}
                  onClick={e => this._searchLocation()}
                >
                  <i className="material-icons">search</i>
                </button>
              </div>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default AddMarker;
