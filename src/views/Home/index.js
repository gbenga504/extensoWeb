import React from "react";
import PropTypes from "prop-types";
import { Connector } from "react-composer";

let Home = null;

export default (Home = props => (
  <Connector
    name="home_router_link"
    loader={() => import("./Home")}
    loadingComponent={null}
    errorComponent={null}
    delay={2000}
    timeout={10000}
  >
    {(Component, props) => {
      let _props = { ...this.props, ...props };
      return <Component {..._props} />;
    }}
  </Connector>
));
