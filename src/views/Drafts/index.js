import React from "react";
import PropTypes from "prop-types";
import { Connector } from "react-composer";

let Draft = null;

export default (Draft = props => (
  <Connector
    name="draft_router_link"
    loader={() => import("./Draft")}
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
