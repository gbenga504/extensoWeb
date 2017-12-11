import React from "react";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

import AppRoutes from "./Routes";
import { appReducer } from "./reducers";

const store = createStore(
  combineReducers({
    ...appReducer
  }),
  {},
  compose(applyMiddleware(createLogger(), thunk))
);

export default () => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);
