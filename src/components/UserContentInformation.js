import React from "react";
import styled from "styled-components";

import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";
import { LightText, RegularText } from "../AppText";

const ImageContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: ${Colors.card.imageContainerBackground};
  color: ${Colors.card.avatar};
`;

const Header = props => (
  <div className="d-flex">
    <ImageContainer className="d-flex justify-content-center align-items-center">
      <LightText style={Fonts.avatar.sm}>A</LightText>
    </ImageContainer>
    <div className="d-flex flex-column" style={{ marginLeft: 13 }}>
      <RegularText style={Fonts.posterName.sm}>Admin</RegularText>
      <LightText style={Fonts.timePosted.sm}>
        On September 14 <sup>.</sup> 4 mins Read
      </LightText>
    </div>
  </div>
);

export default Header;
