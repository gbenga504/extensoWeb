import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { LoginUtils } from "../../utils";
import LoginInput from "./LoginInput";
import Colors from "../../assets/Colors";
import { ToolTip } from "../PopOver";

const Container = styled.div`
  background-color: ${Colors.login.formBackgroundColor};
  padding: 30px;
`;
const Password = styled(LoginInput)`
  &::after {
    content: "";
    position: absolute;
    border-color: ${Colors.login.formAfterColor};
    border-style: solid;
    border-width: 0px 20px 20px 0px;
    height: 0px;
    margin-top: 59px;
    margin-left: 70px;
    transform: rotate(45deg);
  }
`;

export default class Form extends React.PureComponent {
  state = {
    username: "",
    password: "",
    isLoading: false,
    isTooltipVisible: false,
    tooltipMessage: "",
    tooltipPosition: "",
    toolTippedElement: null
  };

  static propTypes = {
    isLoading: PropTypes.func
  };

  login = () => {
    let { username, password } = this.state;
    if (LoginUtils.loginValidation(username, password)) {
      this.setState({ isLoading: true }, () =>
        this.props.isLoading(this.state.isLoading)
      );
    } else {
      this.setState(
        {
          isTooltipVisible: true,
          tooltipMessage: "Oops, check your details",
          tooltipPosition: "tooltip-position-top",
          toolTippedElement: "username"
        },
        () => setTimeout(() => this.setState({ isTooltipVisible: false }), 3000)
      );
    }
  };

  render() {
    let {
      isLoading,
      toolTippedElement,
      isTooltipVisible,
      tooltipMessage,
      tooltipPosition
    } = this.state;
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center">
        <LoginInput
          className={toolTippedElement === "username" ? "data-tooltip" : ""}
          placeholderIcon="ion-person"
          placeholder="Enter your username"
          type="text"
          onChange={ev => this.setState({ username: ev.target.value })}
        />
        <Password
          className={toolTippedElement === "password" ? "data-tooltip" : ""}
          placeholderIcon="ion-key"
          placeholder="Enter your password"
          type="password"
          style={{ marginTop: 10 }}
          rightPlaceholderType={isLoading ? "button" : "icon"}
          rightPlaceholderIcon="ion-ios-arrow-forward"
          onChange={ev => this.setState({ password: ev.target.value })}
          onSubmit={this.login}
        />
        {isTooltipVisible && (
          <ToolTip dataPosition={tooltipPosition} title={tooltipMessage} />
        )}
      </Container>
    );
  }
}
