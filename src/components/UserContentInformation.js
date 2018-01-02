import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import moment from "moment";

import Colors from "../assets/Colors";
import Fonts from "../assets/Fonts";
import { LightText, RegularText } from "./AppText";

const ImageContainer = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background: ${Colors.card.imageContainerBackground};
  color: ${Colors.card.avatar};
`;

class UserContentInformation extends React.PureComponent {
  state = {
    categoryColor:
      UserContentInformation.defaults.colors[Math.floor(Math.random() * 6)]
  };

  static propTypes = {
    hideDetails: PropTypes.bool,
    style: PropTypes.object,
    category: PropTypes.string,
    createdAt: PropTypes.string,
    content: PropTypes.string
  };

  static defaults = {
    colors: [
      "#605CA9",
      "#932290",
      "#39B979",
      "#764B1F",
      "#F2651C",
      "#127C2C",
      "#9F0306"
    ]
  };

  permutateReadingTime = () => {
    let readTime = Math.floor(parseInt(this.props.content.length) / 150);
    return readTime === 0 ? 1 : readTime;
  };

  render() {
    return (
      <div className="d-flex" style={this.props.style}>
        <ImageContainer className="d-flex justify-content-center align-items-center">
          <LightText style={Fonts.avatar.sm}>A</LightText>
        </ImageContainer>
        <div className="d-flex flex-column" style={{ marginLeft: 13 }}>
          <RegularText style={Fonts.posterName.sm}>
            Admin{" "}
            {!this.props.hideDetails && (
              <span style={{ color: this.state.categoryColor }}>
                <sup>.</sup>In {this.props.category}
              </span>
            )}
          </RegularText>
          {!this.props.hideDetails && (
            <LightText style={Fonts.timePosted.sm}>
              {`On ${moment(this.props.createdAt).format("MMMM DD, YYYY")}`}{" "}
              <sup>.</sup> {this.permutateReadingTime()} mins Read
            </LightText>
          )}
        </div>
      </div>
    );
  }
}

export default UserContentInformation;
