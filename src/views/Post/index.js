import React from "react";
import { Connector } from "react-kunyora";

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
    {(Component, passedProps) => {
      let _props = { ...props, ...passedProps };
      return <Component {..._props} />;
    }}
  </Connector>
));
