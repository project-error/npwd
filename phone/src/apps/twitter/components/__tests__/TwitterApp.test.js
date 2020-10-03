import React from "react";
import ReactDOM from "react-dom";
import { TwitterApp } from "../TwitterApp";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<TwitterApp />, div);
});
