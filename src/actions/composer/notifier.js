import * as types from "./types";

/**
 * @param {number} progress
 * @function sets the load progress bar state of each page loading state  
 */
export const setProgressState = progress => {
  return {
    type: types.SET_PAGE_LOAD_PROGRESS,
    progress
  };
};

export const completeProgressState = progress => dispatch => {
  let start = window.performance.now(),
    duration = 1000;
  let animation = requestAnimationFrame(function animate(time) {
    if (!animation) {
      return;
    }
    let movement = (time - start) / duration;
    if (movement >= 1) {
      movement = 1;
      dispatch(setProgressState(movement * 100));
      animation = null;
    } else {
      dispatch(setProgressState(movement < 0.5 ? progress : movement * 100));
      requestAnimationFrame(animate);
    }
  });
};

export const setRouteDatas = (routeName, routeDatas) => {
  return {
    types: types.SET_ROUTE_DATAS,
    routeName,
    routeDatas
  };
};
