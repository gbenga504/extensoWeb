import React from "react";
import styled from "styled-components";

import LoginInput from "./LoginInput";
import Colors from "../../assets/Colors";

const Container = styled.div`
  background-color: ${Colors.login.formBackgroundColor};
  padding: 30px;

  &::after {
    content: "";
    position: absolute;
    border-color: ${Colors.login.formAfterColor};
    border-style: solid;
    border-width: 0px 20px 20px 0px;
    height: 0px;
    margin-top: 75px;
    margin-left: -200px;
    transform: rotate(45deg);
  }
`;

const Form = props => (
  <Container className="d-flex flex-column align-items-center justify-content-center">
    <LoginInput
      placeholderIcon="ion-person"
      placeholder="Enter your username"
      type="text"
    />
    <LoginInput
      placeholderIcon="ion-key"
      placeholder="Enter your password"
      type="password"
      style={{ marginTop: 10 }}
      rightPlaceholderIcon="ion-ios-arrow-forward"
    />
  </Container>
);

export default Form;
