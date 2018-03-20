import React from "react";
import PropTypes from "prop-types";
import { Connector } from "react-composer";

let Section = null;

export default (Section = props => (
  <Connector
    name="section_router_link"
    loader={() => import("./Section")}
    loadingComponent={null}
    errorComponent={null}
    delay={2000}
    timeout={10000}
  >
    {(Component, passedProps) => {
      let _props = { ...props, ...passedProps };
      return <Component {..._props} />;
    }}
  </Connector>
));
