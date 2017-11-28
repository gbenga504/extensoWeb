import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Colors from "../../assets/Colors";
import UserContentInformation from "../UserContentInformation";
import Body from "./Body";
import Footer from "./Footer";

const Container = styled.div`
  padding: 10px 20px;
  background: ${Colors.card.background};
  box-shadow: 0 1px 4px ${Colors.card.boxShadow};
  border-radius: 3px;
  border: 1px solid ${Colors.card.border};
  margin: 25px 0px;
  width: 100%;
`;

export default class Card extends React.PureComponent {
  static PropTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    hideLikes: PropTypes.bool
  };

  render() {
    return (
      <Container
        className={`d-flex flex-column ${this.props.className}`}
        style={this.props.style}
      >
        <UserContentInformation />
        <Body isDisplayImageSet={true} />
        <Footer hideLikes />
      </Container>
    );
  }
}
