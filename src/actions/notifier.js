import * as types from "./types";
import axios from "axios";

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

export const deleteImages = images => (dispatch, getState) => {
  return Promise.all([...handleImagesDeletion(images)])
    .then(data => {
      console.log("delete all unused images");
    })
    .catch(err => {
      console.log("An error occurred in deleting data ", err);
    });
};

const handleImagesDeletion = images => {
  let baseURL = `https://api.cloudinary.com/v1_1/gbenga504/delete_by_token`;
  let composedAxiosInstance = images.reduce((acc, { delete_token }) => {
    let _instance = axios({
      method: "post",
      baseURL,
      data: { token: delete_token }
    });
    acc.push(_instance);
    return acc;
  }, []);
  return composedAxiosInstance;
};
