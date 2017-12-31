import React from "react";
import styled from "styled-components";
import uuid from "uuid";
import PropTypes from "prop-types";

import Colors from "../../assets/Colors";
import { RegularText } from "../AppText";
import SelectCategory from "../SelectCategory";
import Title from "./Title";
import Body from "./Body";

const Category = styled(SelectCategory)`
  margin-left: 50px;
`;

export default class Form extends React.PureComponent {
  constructor(props) {
    super(props);
    let { data } = props;
    this.state = {
      uuid: (data && data.id) || uuid(),
      token: localStorage.getItem("jwt"),
      bodyHTML: (data && data.content) || "",
      titleHTML: (data && data.title) || "",
      category: (data && data.category) || "",
      tags: (data && data.tags) || ""
    };
    this.timer = undefined;
  }

  static propTypes = {
    draftStatusText: PropTypes.string.isRequired,
    draft: PropTypes.bool.isRequired,
    onSaveDraft: PropTypes.func.isRequired,
    initFormRef: PropTypes.func.isRequired,
    data: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
      category: PropTypes.string,
      tags: PropTypes.string,
      draft: PropTypes.bool,
      created_at: PropTypes.string,
      likes_count: PropTypes.string
    })
  };

  componentDidMount() {
    this.props.initFormRef(this.form, this.state.uuid);
  }

  saveDraft = () => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let { titleHTML, bodyHTML, category } = this.state;
      if (
        titleHTML.trim().length > 0 &&
        bodyHTML.trim().length > 0 &&
        category.trim().length > 0
      ) {
        this.props.onSaveDraft(true);
      }
    }, 5000);
  };

  render() {
    let { draftStatusText, draft } = this.props,
      { bodyHTML, titleHTML, category, tags, uuid, token } = this.state;
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
            onCategorySelected={category => this.setState({ category })}
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
          onChange={ev => this.setState({ titleHTML: ev.target.value })}
        />
        <Body
          value={bodyHTML}
          onChange={text => this.setState({ bodyHTML: text })}
        />

        <input type="hidden" value={token} name="token" />
        <input type="hidden" value={uuid} name="id" />
        <input type="hidden" value={category} name="category" />
        <input type="hidden" value={titleHTML} name="title" />
        <input type="hidden" value={bodyHTML} name="content" />
        <input type="hidden" value={draft} name="draft" />
        <input type="hidden" value={tags} name="tags" />
      </form>
    );
  }
}
