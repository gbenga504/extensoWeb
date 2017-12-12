import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { composer } from "../../containers/composer";
import { LoginUtils } from "../../utils";
import LoginInput from "./LoginInput";
import Colors from "../../assets/Colors";
import { ToolTip } from "../PopOver";

const Container = styled.form`
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

class Form extends React.PureComponent {
  state = {
    username: "",
    password: "",
    isTooltipVisible: false,
    tooltipMessage: "",
    tooltipPosition: "",
    toolTippedElement: null
  };

  static propTypes = {
    isLoading: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.login_post.loading !== nextProps.login_post.loading) {
      this.props.isLoading(nextProps.login_post.loading);
    }
  }

  setToolTipVisibility = (
    tooltipMessage,
    toolTippedElement,
    tooltipPosition
  ) => {
    this.setState(
      {
        isTooltipVisible: true,
        tooltipMessage,
        tooltipPosition,
        toolTippedElement
      },
      () => setTimeout(() => this.setState({ isTooltipVisible: false }), 3000)
    );
  };

  login = () => {
    let { username, password } = this.state;
    if (LoginUtils.loginValidation(username, password)) {
      this.props
        .login({
          url: "https://agro-extenso.herokuapp.com/api/v1/admin/login",
          formRef: this.form
        })
        .then(result => {
          let { message: { status, data } } = result,
            { history: { push } } = this.props;
          if (status === "error") {
            this.setToolTipVisibility(data, "username", "tooltip-position-top");
          } else {
            localStorage.setItem("jwt", data);
            push("/");
          }
        })
        .catch(err =>
          this.setToolTipVisibility(
            "Oops, a network error occurred",
            "username",
            "tooltip-position-top"
          )
        );
    } else {
      this.setToolTipVisibility(
        "Oops, check your details",
        "username",
        "tooltip-position-top"
      );
    }
  };

  render() {
    let {
        toolTippedElement,
        isTooltipVisible,
        tooltipMessage,
        tooltipPosition
      } = this.state,
      { loading } = this.props;
    return (
      <Container
        className="d-flex flex-column align-items-center justify-content-center"
        encType="multipart/form-data"
        innerRef={formRef => (this.form = formRef)}
      >
        <LoginInput
          className={toolTippedElement === "username" ? "data-tooltip" : ""}
          placeholderIcon="ion-person"
          placeholder="Enter your username"
          type="text"
          name="username"
          onChange={ev => this.setState({ username: ev.target.value })}
        />
        <Password
          className={toolTippedElement === "password" ? "data-tooltip" : ""}
          placeholderIcon="ion-key"
          placeholder="Enter your password"
          type="password"
          name="password"
          style={{ marginTop: 10 }}
          rightPlaceholderType={loading ? "button" : "icon"}
          rightPlaceholderIcon="ion-ios-arrow-forward"
          onChange={ev => this.setState({ password: ev.target.value })}
          onSubmit={loading ? () => null : this.login}
        />
        {isTooltipVisible && (
          <ToolTip dataPosition={tooltipPosition} title={tooltipMessage} />
        )}
      </Container>
    );
  }
}

const LoginWithMutation = composer("POST", {
  name: "login_post",
  options: {
    variables: {
      url: "https://agro-extenso.herokuapp.com/api/v1/admin/login"
    }
  },
  props: ({ mutate, login_post }) => ({
    login: mutate,
    login_post
  })
})(Form);

export default LoginWithMutation;
