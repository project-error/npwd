import React from "react";
import { SvgIcon } from "@material-ui/core";

export const CalculatorIcon = ({ ...props }) => {
  return (
    <SvgIcon {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        enableBackground="new 0 0 56 56"
        version="1.1"
        viewBox="0 0 56 56"
        xmlSpace="preserve"
      >
        <path fill="#EBBA16" d="M0 0H28V28H0z"></path>
        <path fill="#ED8A19" d="M28 0H56V28H28z"></path>
        <path fill="#ED8A19" d="M0 28H28V56H0z"></path>
        <path fill="#556080" d="M28 28H56V56H28z"></path>
        <path
          fill="#FFF"
          d="M48 46H36a1 1 0 110-2h12a1 1 0 110 2zM48 40H36a1 1 0 110-2h12a1 1 0 110 2zM14 43a.999.999 0 01-.707-1.707l5-5a.999.999 0 111.414 1.414l-5 5A.997.997 0 0114 43z"
        ></path>
        <path
          fill="#FFF"
          d="M9 48a.999.999 0 01-.707-1.707l5-5a.999.999 0 111.414 1.414l-5 5A.997.997 0 019 48z"
        ></path>
        <path
          fill="#FFF"
          d="M19 48a.997.997 0 01-.707-.293l-5-5a.999.999 0 111.414-1.414l5 5A.999.999 0 0119 48z"
        ></path>
        <path
          fill="#FFF"
          d="M14 43a.997.997 0 01-.707-.293l-5-5a.999.999 0 111.414-1.414l5 5A.999.999 0 0114 43zM20 15H8a1 1 0 110-2h12a1 1 0 110 2z"
        ></path>
        <path
          fill="#FFF"
          d="M14 21a1 1 0 01-1-1V8a1 1 0 112 0v12a1 1 0 01-1 1zM48 15H36a1 1 0 110-2h12a1 1 0 110 2z"
        ></path>
      </svg>
    </SvgIcon>
  );
};
