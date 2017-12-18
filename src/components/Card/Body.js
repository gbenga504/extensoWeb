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

const createContentInnerHTML = content => ({
  __html: `${content}...`
});

const Body = props => (
  <Container className="d-flex flex-column">
    {props.isDisplayImageSet && (
      <ImageContainer>
        <img alt="" src="" style={{ width: "100%", height: "100%" }} />
      </ImageContainer>
    )}
    <RegularText style={{ ...Fonts.title.sm, marginTop: 10 }}>
      {props.title}
    </RegularText>
    <LightText
      style={{ ...Fonts.postBody.sm, marginTop: 15 }}
      dangerouslySetInnerHTML={createContentInnerHTML(props.content)}
    />
  </Container>
);

Body.propTypes = {
  isDisplayImageSet: PropTypes.bool,
  title: PropTypes.string,
  content: PropTypes.string
};

export default Body;
