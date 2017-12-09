import React from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

import { GeneralBasedUtils } from "../utils";
import LayoutContainer from "../containers/LayoutContainer";
import DashboardNavigation from "../components/DashboardNavigation";
import Colors from "../assets/Colors";

import Home from "../views/Home";
import Post from "../views/Post";
import Content from "../views/Content";
import Drafts from "../views/Drafts";
import Section from "../views/Section";
import Search from "../views/Search";

const Container = styled(LayoutContainer)`
  background: ${Colors.defaultThemeColor};
  padding: 0;
`;

export default class MainThemeTemplate extends React.PureComponent {
  render() {
    return (
      <Container>
        <DashboardNavigation
          {...GeneralBasedUtils.sanitizeProps(this.props, ["route"])}
        />
        <div className="d-flex" style={{ width: "100%", marginLeft: 70 }}>
          <Switch>
            <Route
              exact
              render={props => {
                let newProps = { ...props, route: this.props.route };
                return <Home {...newProps} />;
              }}
              path="/"
            />
            <Route exact component={Post} path="/post" />
            <Route exact component={Content} path="/content" />
            <Route exact component={Drafts} path="/drafts" />
            <Route exact component={Section} path="/sections" />
            <Route exact component={Search} path="/search" />
          </Switch>
        </div>
      </Container>
    );
  }
}
