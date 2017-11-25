import React from "react";
import PropTypes from "prop-types";

const LayoutContainer = props => (
  <div className={`d-flex ${props.className || ""}`} style={{ height: "100%" }}>
    {props.children}
  </div>
);

LayoutContainer.propTypes = {
  className: PropTypes.string
};

export default LayoutContainer;
