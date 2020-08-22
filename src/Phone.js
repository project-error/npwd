import React from "react";
import "./Phone.css";

function Phone() {
  return (
    <div className="PhoneWrapper">
      <div style={{ zoom: '80%' }}>
        <div className="Phone">
          <div
            className="PhoneFrame"
            style={{
              backgroundImage: `url(/public/media/frames/defaults.png)`,
            }}
          ></div>
          <div className="PhoneScreen" id="phone">
            Wasap
          </div>
        </div>
      </div>
    </div>
  );
}

export default Phone;
