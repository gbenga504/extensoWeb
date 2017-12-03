import React from "react";

export default props => (
  <div className={`d-flex ${props.className}`} style={{ marginTop: 70 }}>
    {props.children}
  </div>
);
