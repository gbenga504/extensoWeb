import * as notifierComposerReducer from "./composer/notifier";
import * as notifierAppReducer from "./notifier";

export const appReducer = Object.assign(
  {},
  notifierComposerReducer,
  notifierAppReducer
);
