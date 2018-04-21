import React from "react";
import PropTypes from "prop-types";

import Input from "../Input";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";

const TitleBox = Input.extend`
  height: 50px;
  border: 1px solid ${Colors.postInputBorder};
  margin-top: 40px;
  margin-left: 50px;
  font-weight: 600;

  &::-webkit-input-placeholder {
    color: #b3b3b1;
  }

  &::-moz-placeholder {
    color: #b3b3b1;
  }

  &::-ms-input-placeholder {
    color: #b3b3b1;
  }

  &:-moz-placeholder {
    color: #b3b3b1;
  }
`;

const Title = props => (
  <TitleBox
    disabled={props.disabled}
    value={props.value}
    onChange={props.onChange}
    style={Fonts.post.titleBox}
    placeholder={props.disabled ? "Select a category " : "Title"}
  />
);

Title.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Title;
