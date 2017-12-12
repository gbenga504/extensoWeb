import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Input from "../Input";
import Icon from "../Icon";
import { CircularSpinner } from "../Loaders";
import Colors from "../../assets/Colors";

const PlaceholderContainer = styled.div`
  background: ${Colors.login.formInputLeftBackground};
  height: inherit;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  width: 40px;
  border-right: 1px solid ${Colors.login.formInputLeftBorder};
`;
const RightIconPlaceholderContainer = PlaceholderContainer.extend`
  background: ${Colors.login.formInputRightBackground};
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  cursor: pointer;
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
    className={`d-flex ${props.className}`}
    style={
      props.style
        ? { height: "40px", width: "100%", ...props.style }
        : { height: "40px", width: "100%" }
    }
  >
    <PlaceholderContainer className="d-flex align-items-center justify-content-center">
      <Icon className={props.placeholderIcon} />
    </PlaceholderContainer>
    <PlaceholderInput
      className="d-flex"
      name={props.name}
      type={props.type}
      onChange={props.onChange}
      placeholder={props.placeholder}
      rightPlaceholderIcon={props.rightPlaceholderIcon || undefined}
    />
    {props.rightPlaceholderIcon && (
      <RightIconPlaceholderContainer
        onClick={props.onSubmit}
        className="d-flex align-items-center justify-content-center"
        rightPlaceholderIcon={props.rightPlaceholderIcon || undefined}
      >
        {props.rightPlaceholderType === "icon" ? (
          <Icon
            className={props.rightPlaceholderIcon}
            forceColor
            style={{ color: Colors.login.formRightIcon }}
          />
        ) : (
          <CircularSpinner
            size={15}
            color={`${Colors.login.formLoginSpinnerIcon}`}
          />
        )}
      </RightIconPlaceholderContainer>
    )}
  </div>
);

LoginInput.propTypes = {
  style: PropTypes.object,
  placeholderIcon: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  rightPlaceholderIcon: PropTypes.string,
  rightPlaceholderType: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  name: PropTypes.string.isRequired
};

export default LoginInput;
