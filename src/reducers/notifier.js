import * as types from "../actions/types";

export const reportNotification = (state = {}, action) => {
  switch (action.type) {
    case types.SET_REPORT_NOTIFICATION:
      return { ...state, ...action.report };
      break;
    default:
      return state;
      break;
  }
};

export const isSearchDraftBased = (state = {}, action) => {
  switch (action.type) {
    case types.SET_CONTENT_ISDRAFT_STATE:
      return { ...state, isDraft: action.isDraft };
      break;
    default:
      return state;
      break;
  }
};

export const isIndefiniteProgressLoading = (state = {}, action) => {
  switch (action.type) {
    case types.SET_INDEFINITE_PROGRESS_STATE:
      return { ...state, loading: action.loading };
      break;
    default:
      return state;
      break;
  }
};

export const pageHandshakeProgress = (state = {}, action) => {
  switch (action.type) {
    case types.SET_PAGE_HANDSHAKE_PROGRESS:
      return { ...state, progress: action.progress };
      break;
    default:
      return state;
      break;
  }
};
