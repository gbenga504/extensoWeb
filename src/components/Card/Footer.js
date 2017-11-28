import React from "react";

import Icon from "../Icon";
import Fonts from "../../assets/Fonts";
import Colors from "../../assets/Colors";
import { LightText } from "../AppText";

const Footer = props => (
  <div
    className="d-flex justify-content-between align-items-center"
    style={{ marginTop: 10 }}
  >
    {props.hideLikes ? (
      <span />
    ) : (
      <div className="d-flex">
        <Icon className="ion-heart" size="30" />
        <LightText style={{ ...Fonts.likesCount.sm, marginLeft: 5 }}>
          8
        </LightText>
      </div>
    )}
    <div className="d-flex">
      <Icon className="ion-edit" size="30" style={{ cursor: "pointer" }} />
      <Icon
        forceColor
        className="ion-ios-trash"
        size="30"
        style={{ color: Colors.card.delete, marginLeft: 20, cursor: "pointer" }}
      />
    </div>
  </div>
);

export default Footer;
