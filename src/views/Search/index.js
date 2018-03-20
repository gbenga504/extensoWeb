import React from "react";
import PropTypes from "prop-types";
import { Connector } from "react-composer";

let Search = null;

export default (Search = props => (
  <Connector
    name="search_router_link"
    loader={() => import("./Search")}
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
