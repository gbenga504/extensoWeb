import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./views/Login";
import MainThemeTemplate from "./templates/MainThemeTemplate";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact component={Login} path="/login" />
          <Route component={MainThemeTemplate} path="/" />
        </Switch>
      </Router>
    );
  }
}

export default App;
