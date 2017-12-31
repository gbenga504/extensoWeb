import React from "react";
import styled from "styled-components";

import { LightText } from "../../components/AppText";
import LayoutContainer from "../../containers/LayoutContainer";
import Form from "../../components/Login/Form";
import Colors from "../../assets/Colors";
import { RainbowLoader } from "../../components/Loaders";
import { GeneralBasedUtils } from "../../utils";

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
  state = {
    height: window.innerHeight,
    isLoading: false
  };
  
  render() {
    return (
      <Container color={Colors.login.themeColor}>
        <div
          className="d-flex flex-column justify-content-center"
          style={{
            width: "100%",
            height: this.state.height,
            overflowX: "hidden"
          }}
        >
          {this.state.isLoading && <RainbowLoader />}
          <Form
            isLoading={isLoading => this.setState({ isLoading })}
            {...this.props}
          />
          <Title>SIGN IN</Title>
        </div>
      </Container>
    );
  }
}
