import * as notifierComposerActions from "./composer/notifier";
import * as notifierAppActions from "./notifier";

export const ActionCreators = Object.assign(
  {},
  notifierComposerActions,
  notifierAppActions
);
