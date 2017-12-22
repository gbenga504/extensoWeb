import * as types from "./types";

export const setReportNotification = report => ({
  type: types.SET_REPORT_NOTIFICATION,
  report
});

export const setIsContentDraftState = isDraft => ({
  type: types.SET_CONTENT_ISDRAFT_STATE,
  isDraft
});
