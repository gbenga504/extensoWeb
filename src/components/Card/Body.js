import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { RegularText, LightText } from "../AppText";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";

const Container = styled.div`
  padding: 10px 0px;
  border-bottom: 1px solid ${Colors.card.postBorder};
`;
const ImageContainer = styled.div`
  height: 300px;
  background: ${Colors.card.imageContainer};
`;

const Body = props => (
  <Container className="d-flex flex-column">
    {props.isDisplayImageSet && (
      <ImageContainer>
        <img alt="" src="" style={{ width: "100%", height: "100%" }} />
      </ImageContainer>
    )}
    <RegularText style={{ ...Fonts.title.sm, marginTop: 10 }}>
      Thinking Compression (500mb to 20mb) Huh!
    </RegularText>
    <LightText style={{ ...Fonts.postBody.sm, marginTop: 15 }}>
      Disclaimer: This article was written to abstract all the mathematical
      complexities involved in explaining what's possible and what's not...
    </LightText>
  </Container>
);

Body.propTypes = {
  isDisplayImageSet: PropTypes.bool
};

export default Body;
