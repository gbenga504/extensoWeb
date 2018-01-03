import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Icon from "./Icon";

const Container = styled.div`
  background-color: #e95656;
  bottom: 0;
  margin-bottom: 24px;
  margin-right: 24px;
  position: fixed;
  right: 0;
  cursor: pointer;
  border: none;
  height: 56px;
  outline: none;
  text-align: center;
  width: 56px;
  z-index: 4000;
  border-radius: 50%;
  padding: 6px 0px;
  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
`;

const AppFab = props => (
  <Container onClick={props.onClick}>
    <Icon
      forceColor
      size="30px"
      style={{ color: "#fff" }}
      className="ion-email"
    />
  </Container>
);

AppFab.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default AppFab;
