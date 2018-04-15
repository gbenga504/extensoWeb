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
    setReportNotification: PropTypes.func.isRequired
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
    const file = e.target.files[0];
    if (file.type.indexOf("image/") !== -1) {
      this.props.setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, {
          src: URL.createObjectURL(file),
          className: "gbenga"
        })
      );

      this.getAddedImageKey();

      axios
        .post(
          "https://api.cloudinary.com/v1_1/gbenga504/image/upload",
          this.composeFormData(file)
        )
        .then(response => {
          const data = response.data;
          const fileURL = data.secure_url;
          this.props.setEditorState(
            updateDataOfBlock(
              this.props.getEditorState(),
              this.props
                .getEditorState()
                .getCurrentContent()
                .getBlockForKey(this.key),
              {
                className: "extenso-img",
                publicuri: data.public_uri,
                src: fileURL
              }
            )
          );
        })
        .catch(err => {
          this.props.setReportNotification({
            id: Date.now(),
            message: "Could not upload image",
            type: "error"
          });

          this.props.setEditorState(
            resetBlockWithType(
              this.props.getEditorState(),
              undefined,
              undefined,
              this.key
            )
          );
        });
    }
    this.props.close();
  }
}
