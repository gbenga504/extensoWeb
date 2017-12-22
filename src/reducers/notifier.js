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
