import React from "react";
import { Connector } from "react-composer";

import { CircularSpinner } from "../../components/Loaders";

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
    {(Component, passedProps) => {
      let _props = { ...props, ...passedProps };
      return <Component {..._props} />;
    }}
  </Connector>
));
