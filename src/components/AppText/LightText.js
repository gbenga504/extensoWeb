import React from "react";

export default props => (
  <span
    {...props}
    style={
      props.style
        ? { ...props.style, fontFamily: "Circular Light" }
        : { fontFamily: "Circular Light" }
    }
  >
    {props.children}
  </span>
);
