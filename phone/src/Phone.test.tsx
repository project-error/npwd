import React from "react";
import { RecoilRoot } from "recoil";
import { shallow } from "enzyme";
import Phone from "./Phone";

it("renders Phone", () => {
  shallow(
    <RecoilRoot>
      <Phone />
    </RecoilRoot>
  );
});
