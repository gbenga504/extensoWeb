import React from "react";

export default props => (
  <span
    {...props}
    style={
      props.style
        ? { ...props.style, fontFamily: "Circular Bold" }
        : { fontFamily: "Circular Bold" }
    }
  >
    {props.children}
  </span>
);
