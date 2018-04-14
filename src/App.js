import React from "react";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import KunyoraClient from "kunyora";
import { KunyoraProvider } from "react-kunyora";

import AppRoutes from "./Routes";
import { appReducer } from "./reducers";
import config from "./composer.config";

const Client = KunyoraClient({ ...config });

const store = createStore(
  combineReducers({
    ...appReducer
  }),
  {},
  compose(applyMiddleware(createLogger(), thunk))
);

export default () => (
  <KunyoraProvider client={Client} store={Client.store}>
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  </KunyoraProvider>
);
