import React from "react";
import PropTypes from "prop-types";

import "./index.css";

const CircularSpinner = props => (
  <div
    className="circular-spinner"
    style={{
      display: `${props.display}`,
      width: `${props.size}px`,
      height: `${props.size}px`,
      borderRadius: "50%",
      border: `${props.thickness}px solid #f3f3f3`,
      borderTop: `${props.thickness}px solid ${props.color}`,
      borderBottom: `${props.thickness}px solid ${props.color}`,
      ...props.style
    }}
  />
);

CircularSpinner.propTypes = {
  display: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

CircularSpinner.defaultProps = {
  display: "block",
  size: "30",
  thickness: "3",
  color: "#2c8482"
};

export default CircularSpinner;
