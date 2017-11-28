import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { RegularText, LightText } from "../AppText";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";
import UserContentInformation from "../UserContentInformation";
import Icon from "../Icon";

const Container = styled.div`
  padding: 10px 20px;
  background: ${Colors.card.background};
  box-shadow: 0 1px 4px ${Colors.card.boxShadow};
  border-radius: 3px;
  border: 1px solid ${Colors.card.border};
  margin: 25px 0px;
  width: 100%;
`;
const ImageContainer = styled.div`
  height: 101px;
  background: ${Colors.card.imageContainer};
`;

export default class ContentCard extends React.PureComponent {
  static PropTypes = {
    style: PropTypes.object,
    className: PropTypes.string
  };

  render() {
    return (
      <Container
        className={`d-flex flex-column ${this.props.className}`}
        style={this.props.style}
      >
        <ImageContainer>
          <img alt="" src="" style={{ width: "100%", height: "100%" }} />
        </ImageContainer>
        <RegularText style={{ ...Fonts.title.sm, marginTop: 10 }}>
          Thinking Compression (500mb to 20mb) Huh!
        </RegularText>
        <div className="d-flex justify-content-between">
          <UserContentInformation />{" "}
          <div className="d-flex align-self-center">
            <Icon className="ion-heart" size="30" />
            <LightText style={{ ...Fonts.likesCount.sm, marginLeft: 5 }}>
              8
            </LightText>
          </div>
        </div>
      </Container>
    );
  }
}
