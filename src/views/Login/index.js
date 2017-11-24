import React from "react";
import styled from "styled-components";

import LayoutContainer from "../../containers/LayoutContainer";
import Form from "../../components/Login/Form";

const Container = styled(LayoutContainer)`
  background: #292931;
  padding: 0px 400px;
`;

export default class Login extends React.PureComponent {
  render() {
    return (
      <Container className="justify-content-center">
        <div
          className="d-flex flex-column align-self-center"
          style={{ width: "100%" }}
        >
          <Form />
        </div>
      </Container>
    );
  }
}
