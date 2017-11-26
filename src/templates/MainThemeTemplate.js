import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import LayoutContainer from "../containers/LayoutContainer";
import DashboardNavigation from "../components/DashboardNavigation";
import Colors from "../assets/Colors";

import Home from "../views/Home";
import Post from "../views/Post";

const Container = styled(LayoutContainer)`
  background: ${Colors.defaultThemeColor};
  padding: 0;
`;

export default class MainThemeTemplate extends React.PureComponent {
  render() {
    return (
      <Container>
        <DashboardNavigation {...this.props} />
        <div className="d-flex" style={{ width: "100%" }}>
          <Switch>
            <Route exact component={Home} path="/" />
            <Route exact component={Post} path="/post" />
          </Switch>
        </div>
      </Container>
    );
  }
}
