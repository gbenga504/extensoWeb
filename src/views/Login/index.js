import React from "react";
import styled from "styled-components";

import LayoutContainer from "../../containers/LayoutContainer";
import Form from "../../components/Login/Form";

const Container = styled(LayoutContainer)`
  background: #292931;
  padding: 0px 400px;
`;
const Title = styled.span`
  margin-left: 30px;
  margin-top: 20px;
  color: #544a5a;
  font-size: 40px;
  font-family: "Circular Light";
`;

export default class Login extends React.PureComponent {
  render() {
    return (
      <Container className="justify-content-center" color="#292931">
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
