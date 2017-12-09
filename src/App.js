import React from "react";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";

import AppRoutes from "./Routes";
import { appReducer } from "./reducers";

const store = createStore(
  combineReducers({
    ...appReducer
  }),
  {}
);

export default () => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);
