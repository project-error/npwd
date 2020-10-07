import React from "react";

import styled from "styled-components";

const Input = styled("input")`
  text-align: center;
  padding: 10px;
  border: none;
  font-size: 20px;
  outline: none;
  background: transparent;
  color: #fff;
  margin-bottom: 1em;
  border-bottom: 1px solid #fff;
`;

export const TextInput = (props) => (
  <Input
    placeholder={props.placeholder}
    type={props.type}
    defaultValue={props.value}
    onChange={props.onChange}
  />
);
