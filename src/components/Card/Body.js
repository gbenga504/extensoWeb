import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Image } from "cloudinary-react";

import { RegularText } from "../AppText";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";

const Container = styled.div`
  padding: 10px 0px;
  border-bottom: 1px solid ${Colors.card.postBorder};
`;
const ImageContainer = styled.div`
  height: 100px;
  background: ${Colors.card.imageContainer};
`;

class Body extends React.PureComponent {
  state = {
    shouldDisplayThumbnail: false
  };

  static propTypes = {
    isDisplayImageSet: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    src: PropTypes.string
  };

  componentDidMount() {
    this.setState({
      shouldDisplayThumbnail: true
    });
  }

  render() {
    let { isDisplayImageSet, title, src } = this.props;
    return (
      <Container
        className="d-flex flex-column"
        innerRef={ref => (this.containerBoundingBox = ref)}
      >
        {isDisplayImageSet && (
          <ImageContainer>
            {this.state.shouldDisplayThumbnail && (
              <Image
                cloudName="gbenga504"
                publicId={src}
                gravity="center"
                width={this.containerBoundingBox.getBoundingClientRect().width}
                height="100"
                crop="crop"
              />
            )}
          </ImageContainer>
        )}
        <RegularText style={{ ...Fonts.title.sm, marginTop: 10 }}>
          {title}
        </RegularText>
      </Container>
    );
  }
}

export default Body;
