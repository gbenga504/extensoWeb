import React from "react";
import PropTypes from "prop-types";
import { convertToRaw } from "draft-js";
import { Editor, createEditorState } from "medium-draft";
import mediumDraftExporter from "medium-draft/lib/exporter";
import mediumDraftImporter from "medium-draft/lib/importer";

import CustomImageSideButton from "./CustomImageSideButton";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";
import "medium-draft/lib/index.css";
import "./extenso-editor.css";

export default class Body extends React.PureComponent {
  constructor(props) {
    super(props);
    // createEditorState(convertToRaw(mediumDraftImporter(this.props.value)))
    this.state = {
      editorState: createEditorState(this.props.value)
    };
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  sideButtons = [
    {
      title: "Image",
      component: CustomImageSideButton
    }
  ];

  componentDidMount() {
    this.editor.focus();
  }

  onChange = editorState => {
    this.setState({ editorState });
    this.props.onChange(mediumDraftExporter(editorState.getCurrentContent()));
  };

  render() {
    let { editorState } = this.state;
    return (
      <div className="d-flex" style={{ marginTop: 40, marginLeft: 50 }}>
        <Editor
          ref={ref => (this.editor = ref)}
          editorState={editorState}
          onChange={this.onChange}
          sideButtons={this.sideButtons}
        />
      </div>
    );
  }
}
