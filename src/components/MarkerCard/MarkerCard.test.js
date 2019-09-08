import React from "react";
import ReactDOM from "react-dom";

import App from "./MarkerCard";
import M from "materialize-css";

it("renders without crashing", () => {
  const div = document.createElement("div");
  let markerData = [
    {
      id: 5252000659999999,
      formatted_address: "Berlin, Germany",
      location_coordinates: {
        lat: 52.52000659999999,
        lng: 13.404954
      }
    }
  ];
  markerData.map(marker => {
    return ReactDOM.render(<App markerData={marker} />, div);
  });
});
