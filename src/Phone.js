import React from "react";
import "./Phone.css";
import { Route } from "react-router-dom";
import { HomeApp } from "./apps/home/components/Home";

function Phone() {
  return (
    <div className="PhoneWrapper">
      <div style={{ zoom: "80%" }}>
        <div className="Phone">
          <div
            className="PhoneFrame"
            style={{
              backgroundImage: `${process.env.PUBLIC_URL}url(/media/frames/default.png)`,
            }}
          ></div>
          <div className="PhoneScreen" id="phone">
            <div className="PhoneAppContainer">
              <Route exact path="/" component={HomeApp} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Phone;
