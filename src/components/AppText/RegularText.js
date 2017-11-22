import React from "react";

export default props => (
  <span
    {...props}
    style={
      props.style
        ? { ...props.style, fontFamily: "Circular Medium" }
        : { fontFamily: "Circular Medium" }
    }
  >
    {props.children}
  </span>
);
