import React from "react";
import styled from "styled-components";

import Input from "../Input";

const PlaceholderContainer = styled.div`
  background: #dedede;
  height: inherit;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  width: 40px;
  border-right: 1px solid #bdbdbd;
`;
const Placeholder = styled.i`
  color: #484848;
  fontsize: 20px;
`;
const PlaceholderInput = Input.extend`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  height: inherit;
`;

const LoginInput = props => (
  <div
    className="d-flex"
    style={
      props.style
        ? { height: "40px", width: "100%", ...props.style }
        : { height: "40px", width: "100%" }
    }
  >
    <PlaceholderContainer className="d-flex align-items-center justify-content-center">
      <Placeholder className={props.placeholderIcon} />
    </PlaceholderContainer>
    <PlaceholderInput
      className="d-flex"
      type={props.type}
      placeholder={props.placeholder}
    />
  </div>
);

export default LoginInput;
