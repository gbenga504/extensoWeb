import React from "react";
import styled from "styled-components";

import Input from "../Input";

const PlaceholderContainer = styled.div`
  background: ${props => (props.rightPlaceholderIcon ? "#AD6BAD" : "#dedede")};
  height: inherit;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 40px;
  border-right: 1px solid #bdbdbd;
`;
const RightIconPlaceholderContainer = PlaceholderContainer.extend`
  background: #ad6bad;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: pointer;
`;
const Placeholder = styled.i`
  color: ${props => (props.rightPlaceholderIcon ? "#fff" : "#484848")};
  fontsize: 20px;
`;
const PlaceholderInput = Input.extend`
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: ${props =>
    props.rightPlaceholderIcon ? "0px" : "3px"};
  border-bottom-right-radius: ${props =>
    props.rightPlaceholderIcon ? "0px" : "3px"};
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
      rightPlaceholderIcon={props.rightPlaceholderIcon || undefined}
    />
    {props.rightPlaceholderIcon && (
      <RightIconPlaceholderContainer
        className="d-flex align-items-center justify-content-center"
        rightPlaceholderIcon={props.rightPlaceholderIcon || undefined}
      >
        <Placeholder
          className={props.rightPlaceholderIcon}
          rightPlaceholderIcon={props.rightPlaceholderIcon || undefined}
        />
      </RightIconPlaceholderContainer>
    )}
  </div>
);

export default LoginInput;
