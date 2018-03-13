import * as types from "./types";

export const setReportNotification = report => ({
  type: types.SET_REPORT_NOTIFICATION,
  report
});

export const setIsContentDraftState = isDraft => ({
  type: types.SET_CONTENT_ISDRAFT_STATE,
  isDraft
});

export const setIndefiniteProgressLoadingState = loading => ({
  type: types.SET_INDEFINITE_PROGRESS_STATE,
  loading
});

export const setPageHandshakeProgress = progress => ({
  type: types.SET_PAGE_HANDSHAKE_PROGRESS,
  progress
});
