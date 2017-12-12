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

  &::-webkit-input-placeholder {
    color: #bdbdbd;
  }

  &::-moz-placeholder {
    color: #bdbdbd;
  }

  &::-ms-input-placeholder {
    color: #bdbdbd;
  }

  &:-moz-placeholder {
    color: #bdbdbd;
  }
`;

const Title = props => (
  <div className="d-flex">
    <TitleBox
      value={props.value}
      onChange={props.onChange}
      style={Fonts.post.titleBox}
      placeholder="Enter the title of your post"
    />
  </div>
);

Title.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Title;
