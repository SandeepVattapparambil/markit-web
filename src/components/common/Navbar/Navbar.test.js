import React from "react";
import ReactDOM from "react-dom";

import App from "./Navbar";
import M from "materialize-css";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
});
