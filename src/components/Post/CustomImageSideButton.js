import React from "react";
import {
  ImageSideButton,
  Block,
  addNewBlock,
  createEditorState,
  Editor
} from "medium-draft";

export default class CustomImageSideButton extends ImageSideButton {
  onChange(e) {
    const file = e.target.files[0];
    if (file.type.indexOf("image/") !== -1) {
      this.props.setEditorState(
        addNewBlock(this.props.getEditorState(), Block.IMAGE, { src: "" })
      );
    }
    this.props.close();
  }
}
