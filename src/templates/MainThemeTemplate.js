import React from "react";
import styled from "styled-components";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { Report } from "../components/PopOver";
import { GeneralBasedUtils } from "../utils";
import LayoutContainer from "../containers/LayoutContainer";
import DashboardNavigation from "../components/DashboardNavigation";
import Colors from "../assets/Colors";
import AppFab from "../components/AppFab";
import IndefiniteProgressBar from "../components/IndefiniteProgressBar";
import DefiniteProgressBar from "../components/DefiniteProgressBar";

import Home from "../views/Home";
import Post from "../views/Post";
import Content from "../views/Content";
import Drafts from "../views/Drafts";
import Section from "../views/Section";
import Search from "../views/Search";
import NotFound from "../views/NotFound";

const Container = styled(LayoutContainer)`
  background: ${Colors.defaultThemeColor};
  padding: 0;
`;

class MainThemeTemplate extends React.PureComponent {
  state = {
    expired:
      Date.now() - parseInt(localStorage.getItem("jwt_date_gotten")) > 82800000
  };

  render() {
    let {
      report,
      isIndefiniteProgressLoading,
      pageHandshakeProgress
    } = this.props;
    return (
      <Container>
        {isIndefiniteProgressLoading.loading && <IndefiniteProgressBar />}
        <DefiniteProgressBar progress={pageHandshakeProgress.progress} />
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
                  return <Section {...newProps} />;
                }}
                path="/sections/:category"
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
                  return <Drafts {...newProps} />;
                }}
                path="/drafts/"
              />
              <Route
                render={props => {
                  let newProps = { ...props, route: this.props.route };
                  return <Search {...newProps} />;
                }}
                path="/search"
              />
              <Route
                exact
                render={props => {
                  let newProps = { ...props, route: this.props.route };
                  return <Home {...newProps} />;
                }}
                path="/"
              />
              <Route component={NotFound} />
            </Switch>
          )}
        </div>
        <Report id={report.id} message={report.message} type={report.type} />
        <AppFab
          onClick={() =>
            (window.location.href =
              "mailto:daveanifowoshe@gmail.com?subject=Feedback on Extenso")
          }
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    report: state.reportNotification,
    isIndefiniteProgressLoading: state.isIndefiniteProgressLoading,
    pageHandshakeProgress: state.pageHandshakeProgress
  };
}

export default connect(mapStateToProps)(MainThemeTemplate);
