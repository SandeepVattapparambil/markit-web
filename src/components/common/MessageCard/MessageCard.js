import React, { Component } from "react";

class MessageCard extends Component {
  render() {
    return (
      <div className="col s12 m12">
        <div className="card-panel blue">
          <span className="white-text">
            <strong>Hello..</strong>, welcome to MarkIt, this is a simple app
            which demonstrates the integration of google maps static api and
            geocoding api. You can add markers on the below map using this app.
          </span>
        </div>
      </div>
    );
  }
}

export default MessageCard;
