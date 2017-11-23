import React from "react";
import PropTypes from "prop-types";

const LayoutContainer = props => (
  <div className={`d-flex flex-column ${props.className || ""}`}>
    {props.children}
  </div>
);

LayoutContainer.propTypes = {
  className: PropTypes.string
};

export default LayoutContainer;
