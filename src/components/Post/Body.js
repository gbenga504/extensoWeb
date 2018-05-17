import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Editor } from "medium-draft";
import { getDefaultKeyBinding, KeyBindingUtil } from "draft-js";

import CustomImageSideButton from "./CustomImageSideButton";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";
import "medium-draft/lib/index.css";
import "./extenso-editor.css";

const Container = styled.div`
  margin-top: 40px;
  margin-left: 50px;
  width: 100%px;
  font-size: 21px;
`;

export default class Body extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onSaveDraft: PropTypes.func.isRequired,
    editorState: PropTypes.any.isRequired,
    setReportNotification: PropTypes.func.isRequired,
    onUpdatePostImages: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.editor.focus();
  }

  sideButtons = () => {
    let { onUpdatePostImages } = this.props,
      _props = {
        setReportNotification: this.props.setReportNotification,
        onUpdatePostImages
      };
    return [
      {
        title: "Image",
        component: props => <CustomImageSideButton {...props} {..._props} />
      }
    ];
  };

  onChange = editorState => {
    this.props.onChange(editorState);
  };

  keyBindingFn = e => {
    const { hasCommandModifier } = KeyBindingUtil;
    if (e.keyCode === 83 && hasCommandModifier(e)) {
      return "myeditor-save";
    }
    return getDefaultKeyBinding(e);
  };

  handleKeyCommand = command => {
    if (command === "myeditor-save") {
      // Perform a request to save the contents
      this.props.onSaveDraft(true, false);
      return "handled";
    }
    return "not-handled";
  };

  render() {
    let { editorState } = this.props;
    return (
      <Container className="d-flex">
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          ref={ref => (this.editor = ref)}
          sideButtons={this.sideButtons()}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={this.keyBindingFn}
          placeholder="Write your post"
          style={{ fontSize: 20 }}
        />
      </Container>
    );
  }
}
