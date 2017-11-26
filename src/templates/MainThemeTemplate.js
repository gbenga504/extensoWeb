import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import LayoutContainer from "../containers/LayoutContainer";
import DashboardNavigation from "../components/DashboardNavigation";
import Colors from "../assets/Colors";

import Home from "../views/Home";

const Container = styled(LayoutContainer)`
  background: ${Colors.defaultThemeColor};
  padding: 0;
`;

export default class MainThemeTemplate extends React.PureComponent {
  render() {
    console.log(this.props);
    return (
      <Container>
        <DashboardNavigation />
        <div className="d-flex" style={{ width: "100%" }}>
          <Switch>
            <Route exact component={Home} path="/" />
          </Switch>
        </div>
      </Container>
    );
  }
}
