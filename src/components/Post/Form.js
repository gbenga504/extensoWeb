import React from "react";
import styled from "styled-components";

import Colors from "../../assets/Colors";
import { BoldText } from "../AppText";
import SelectCategory from "../SelectCategory";
import Title from "./Title";
import Body from "./Body";

const Category = styled(SelectCategory)`margin-left: 50px;`;

export default class Form extends React.PureComponent {
  state = {
    bodyHTML: "",
    titleHTML: "",
    category: ""
  };

  render() {
    return (
      <form
        className="d-flex flex-column"
        style={{ marginTop: 50, padding: "0px 200px" }}
      >
        <div className="d-flex justify-content-between">
          <Category
            title={this.state.category}
            onCategorySelected={category => this.setState({ category })}
          />
          <BoldText style={{ color: Colors.postSavedTexxt.normal }}>
            ...Saving
          </BoldText>
        </div>
        <Title
          value={this.state.titleHTML}
          onChange={ev => this.setState({ titleHTML: ev.target.value })}
        />
        <Body
          value={this.state.bodyHTML}
          onChange={text => this.setState({ bodyHTML: text })}
        />

        <input type="hidden" value={this.state.category} name="category" />
        <input type="hidden" value={this.state.titleHTML} name="title" />
        <input type="hidden" value={this.state.bodyHTML} name="body" />
      </form>
    );
  }
}
