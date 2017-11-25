import React from "react";
import styled from "styled-components";

import { LightText } from "../../components/AppText";
import LayoutContainer from "../../containers/LayoutContainer";
import Form from "../../components/Login/Form";
import Colors from "../../assets/Colors";

const Container = styled(LayoutContainer)`
  background: ${Colors.login.backgroundColor};
  padding: 0px 400px;
`;
const Title = styled(LightText)`
  margin-left: 30px;
  margin-top: 20px;
  color: ${Colors.login.title};
  font-size: 40px;
`;

export default class Login extends React.PureComponent {
  render() {
    return (
      <Container
        className="justify-content-center"
        color={Colors.login.themeColor}
      >
        <div
          className="d-flex flex-column align-self-center"
          style={{ width: "100%" }}
        >
          <Form />
          <Title>SIGN IN</Title>
        </div>
      </Container>
    );
  }
}
