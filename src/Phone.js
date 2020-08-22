import React from "react";
import "./Phone.css";

function Phone() {
  return (
    <div class="PhoneWrapper">
      <div class="Phone">
        <div class="PhoneFrame" style={{backgroundImage: `url(/public/media/frames/defaults.png)`}}></div>
        <div class="PhoneScreen" id="phone">
          Wasap
        </div>
      </div>
    </div>
  );
}

export default Phone;
