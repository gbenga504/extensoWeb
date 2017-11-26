import React from "react";
import styled from "styled-components";

import Colors from "../../assets/Colors";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const Container = styled.div`
  width: inherit;
  padding: 10px 20px;
  background: ${Colors.card.background};
  box-shadow: 0 1px 4px ${Colors.card.boxShadow};
  border-radius: 3px;
  border: 1px solid ${Colors.card.border};
  margin: 25px 0px;
  width: 600px;
`;

export default class Card extends React.PureComponent {
  render() {
    return (
      <Container className="d-flex flex-column">
        <Header />
        <Body isDisplayImageSet={true} />
        <Footer />
      </Container>
    );
  }
}
