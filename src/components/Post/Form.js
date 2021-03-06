import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Colors from "../../assets/Colors";
import { RegularText } from "../AppText";
import SelectCategory from "../SelectCategory";
import Title from "./Title";
import Body from "./Body";
import { GeneralBasedUtils } from "../../utils/index";

const Category = styled(SelectCategory)`
  margin-left: 50px;
`;

export default class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timer = undefined;
  }

  static propTypes = {
    draftStatusText: PropTypes.string.isRequired,
    onSaveDraft: PropTypes.func.isRequired,
    initFormRef: PropTypes.func.isRequired,
    onChangeField: PropTypes.func.isRequired,
    editorState: PropTypes.any.isRequired,
    data: PropTypes.shape({
      uuid: PropTypes.string,
      token: PropTypes.string,
      bodyHTML: PropTypes.string,
      titleHTML: PropTypes.string,
      category: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
      draft: PropTypes.bool,
      displaySrc: PropTypes.string
    }),
    setReportNotification: PropTypes.func.isRequired,
    onUpdatePostImages: PropTypes.func.isRequired,
    onUpdateEditorState: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.initFormRef(this.form);
  }

  render() {
    let {
      draftStatusText,
      setReportNotification,
      onChangeField,
      onUpdatePostImages,
      onUpdateEditorState,
      onSaveDraft,
      editorState,
      data: {
        draft,
        bodyHTML,
        titleHTML,
        category,
        tags,
        uuid,
        displaySrc,
        token
      }
    } = this.props;

    return (
      <form
        ref={ref => (this.form = ref)}
        className="d-flex flex-column"
        style={{ marginTop: 50, padding: "0px 200px" }}
        onKeyUp={this.saveDraft}
      >
        <div className="d-flex justify-content-between">
          <Category
            title={category}
            onCategorySelected={category => onChangeField("category", category)}
          />
          <RegularText
            className="align-self-center"
            style={{ color: Colors.postSavedTexxt.normal }}
          >
            {draftStatusText}
          </RegularText>
        </div>
        <Title
          disabled={!(category.trim().length > 0)}
          value={titleHTML}
          onChange={ev => onChangeField("titleHTML", ev.target.value)}
        />
        <Body
          editorState={editorState}
          onChange={editorState => onUpdateEditorState(editorState)}
          setReportNotification={setReportNotification}
          onUpdatePostImages={onUpdatePostImages}
          onSaveDraft={onSaveDraft}
        />
        <input type="hidden" value={token} name="token" />
        <input type="hidden" value={uuid} name="id" />
        <input type="hidden" value={category} name="category" />
        <input type="hidden" value={titleHTML} name="title" />
        <input type="hidden" value={bodyHTML} name="content" />
        <input type="hidden" value={draft} name="draft" />
        <input type="hidden" value={displaySrc} name="src" />
        <input
          type="hidden"
          value={GeneralBasedUtils.formatHashTagsToPostgresArrayType(tags)}
          name="tags"
        />
      </form>
    );
  }
}
