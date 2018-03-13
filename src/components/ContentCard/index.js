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
  cursor: pointer;
`;
const ImageContainer = styled.div`
  height: 101px;
  background: ${Colors.card.imageContainer};
`;

export default class ContentCard extends React.PureComponent {
  static PropTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    item: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string.isRequired),
      draft: PropTypes.bool,
      created_at: PropTypes.string.isRequired,
      likes_count: PropTypes.string
    }),
    onRequestRoute: PropTypes.func.isRequired,
    routeProgress: PropTypes.number,
    reduxActions: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    let {
      routeProgress,
      reduxActions: { setPageHandshakeProgress }
    } = this.props;
    if (routeProgress.routeProgress) {
      setPageHandshakeProgress(nextProps.routeProgress);
    }
  }

  render() {
    let {
      item: { id, title, category, created_at, content, likes_count },
      style,
      className,
      onRequestRoute
    } = this.props;
    return (
      <Container
        className={`d-flex flex-column ${className}`}
        style={style}
        onClick={onRequestRoute}
      >
        <ImageContainer>
          <img alt="" src="" style={{ width: "100%", height: "100%" }} />
        </ImageContainer>
        <RegularText style={{ ...Fonts.title.sm, marginTop: 10 }}>
          {title}
        </RegularText>
        <div className="d-flex justify-content-between">
          <UserContentInformation
            category={category}
            createdAt={created_at}
            content={content}
          />
          <div className="d-flex align-self-center">
            <Icon className="ion-heart" size="30" />
            <LightText style={{ ...Fonts.likesCount.sm, marginLeft: 5 }}>
              {likes_count}
            </LightText>
          </div>
        </div>
      </Container>
    );
  }
}
