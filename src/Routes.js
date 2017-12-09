import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Login from "./views/Login";
import MainThemeTemplate from "./templates/MainThemeTemplate";
import { ActionCreators } from "./actions";

class AppRoute extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact component={Login} path="/login" />
          <Route
            path="/"
            render={props => {
              let newProps = { ...props, route: { ...this.props } };
              return <MainThemeTemplate {...newProps} />;
            }}
          />
        </Switch>
      </Router>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(() => {
  return {};
}, mapDispatchToProps)(AppRoute);
