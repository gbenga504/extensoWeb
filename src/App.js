import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./views/Login";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact component={Login} path="/login" />
        </Switch>
      </Router>
    );
  }
}

export default App;
