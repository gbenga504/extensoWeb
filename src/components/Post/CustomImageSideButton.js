import React from "react";
import {
  ImageSideButton,
  Block,
  addNewBlock,
  resetBlockWithType,
  createEditorState,
  updateDataOfBlock,
  Editor
} from "medium-draft";
import axios from "axios";
import PropTypes from "prop-types";

export default class CustomImageSideButton extends ImageSideButton {
  static propTypes = {
    setReportNotification: PropTypes.func.isRequired,
    onUpdatePostImages: PropTypes.func.isRequired
  };

  getAddedImageKey = () => {
    setTimeout(() => {
      var e = this.props.getEditorState(),
        k = e.getSelection().getStartKey();
      this.key = k;
    }, 0);
  };

  composeFormData = file => {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("tags", "extenso, gist");
    formData.append("upload_preset", "rl0uy02q");
    formData.append("api_key", "538414422437461");
    formData.append("timestamp", (Date.now() / 1000) | 0);

    return formData;
  };

  onChange(e) {
    let {
        setReportNotification,
        setEditorState,
        onUpdatePostImages,
        getEditorState,
        close
      } = this.props,
      file = e.target.files[0];

    if (file.type.indexOf("image/") !== -1) {
      setEditorState(
        addNewBlock(getEditorState(), Block.IMAGE, {
          src: URL.createObjectURL(file),
          className: "uploaded-image"
        })
      );

      this.getAddedImageKey();

      //FIX : Run a cron job when user attempts to save the post when an image is in flight
      axios({
        baseURL: "https://api.cloudinary.com/v1_1/gbenga504/image/upload",
        data: this.composeFormData(file),
        method: "post",
        timeout: 10000
      })
        .then(response => {
          const data = response.data;
          const fileURL = data.secure_url;
          const publicid = data.public_id;

          //update the array of uploaded images array
          onUpdatePostImages(data);

          setEditorState(
            updateDataOfBlock(
              getEditorState(),
              getEditorState()
                .getCurrentContent()
                .getBlockForKey(this.key),
              {
                className: "extenso-img",
                publicid,
                src: fileURL
              }
            )
          );
        })
        .catch(err => {
          setReportNotification({
            id: Date.now(),
            message: "Could not upload image",
            type: "error"
          });

          setEditorState(
            resetBlockWithType(getEditorState(), undefined, undefined, this.key)
          );
        });
    }
    close();
  }
}
