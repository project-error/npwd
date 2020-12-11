import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import "./main.css";
import Phone from "./Phone";
import TwitterNotification from "./apps/twitter/components/notification/TwitterNotification";
import { BankNotification } from "./apps/bank/components/notification/BankNotification";

ReactDOM.render(
  <HashRouter>
    <RecoilRoot>
      <TwitterNotification />
      <BankNotification />
      <Phone />
    </RecoilRoot>
  </HashRouter>,
  document.getElementById("root")
);
