import React from "react";
import PropTypes from "prop-types";
import { Connector } from "react-composer";

let Post = null;

export default (Post = props => (
  <Connector
    name="post_router_link"
    loader={() => import("./Post")}
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
