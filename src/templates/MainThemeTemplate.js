import React from "react";
import styled from "styled-components";
import { Switch, Route, Redirect } from "react-router-dom";

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
  state = {
    expired:
      Date.now() - parseInt(localStorage.getItem("jwt_date_gotten")) > 82800000
  };

  render() {
    return (
      <Container>
        <DashboardNavigation
          {...GeneralBasedUtils.sanitizeProps(this.props, ["route"])}
        />
        <div className="d-flex" style={{ width: "100%", marginLeft: 70 }}>
          {this.state.expired || !localStorage.getItem("jwt") ? (
            <Redirect to="/login" />
          ) : (
            <Switch>
              <Route
                render={props => {
                  let newProps = { ...props, route: this.props.route };
                  return <Post {...newProps} />;
                }}
                path="/post/:postId"
              />
              <Route
                render={props => {
                  let newProps = { ...props, route: this.props.route };
                  return <Post {...newProps} />;
                }}
                path="/post/"
              />
              <Route
                render={props => {
                  let newProps = { ...props, route: this.props.route };
                  return <Content {...newProps} />;
                }}
                path="/content/:postId"
              />
              <Route
                render={props => {
                  let newProps = { ...props, route: this.props.route };
                  return <Home {...newProps} />;
                }}
                path="/"
              />
              <Route component={Drafts} path="/drafts" />
              <Route component={Section} path="/sections" />
              <Route component={Search} path="/search" />
            </Switch>
          )}
        </div>
      </Container>
    );
  }
}
