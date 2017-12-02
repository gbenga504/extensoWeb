import React from "react";
import styled from "styled-components";

import SelectCategory from "../SelectCategory";
import Title from "./Title";
import Body from "./Body";

const Category = styled(SelectCategory)`margin-left: 50px;`;

export default class Form extends React.PureComponent {
  render() {
    return (
      <form
        className="d-flex flex-column"
        style={{ marginTop: 50, padding: "0px 200px" }}
      >
        <Category />
        <Title />
        <Body />
      </form>
    );
  }
}
