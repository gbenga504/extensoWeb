import * as types from "../../actions/composer/types";

/**
 * @param {Object} state 
 * @param {Object} action
 * @function creates the reducer for the progress load state of each page 
 */
export const dataLoadProgress = (state = { progress: 0 }, action) => {
  switch (action.type) {
    case types.SET_PAGE_LOAD_PROGRESS:
      return { ...state, progress: action.progress };
      break;
    default:
      return state;
  }
};

export const routeDatas = (state = {}, action) => {
  switch (action.type) {
    case types.SET_ROUTE_DATAS:
      return { ...state, [`${action.routeName}`]: action.routeDatas };
      break;
    default:
      return state;
  }
};

export const queryDatas = (state = {}, action) => {
  switch (action.type) {
    case types.SET_QUERY_DATAS:
      return { ...state, [`${action.queryName}`]: action.queryDatas };
      break;
    default:
      return state;
  }
};
