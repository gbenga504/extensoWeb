import React, { Component } from "react";
import PropTypes from "prop-types";
import { Connector } from "react-composer";

let Content = null;

export default (Content = props => (
  <Connector
    name="content_router_link"
    loader={() => import("./Content")}
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
