import React from "react";
import PropTypes from "prop-types";

import Card from "./Card";
import { BoldText } from "./AppText";
import Fonts from "../assets/Fonts";
import Colors from "../assets/Colors";

export default class List extends React.PureComponent {
  static propTypes = {
    dataArray: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        category: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        drafts: PropTypes.bool,
        created_at: PropTypes.string.isRequired,
        likes_count: PropTypes.string
      }).isRequired
    ),
    style: PropTypes.object
  };

  render() {
    const { dataArray, style } = this.props,
      styles = style
        ? { padding: "0px 320px", ...this.props.style }
        : { padding: "0px 320px" };

    return (
      <div className="d-flex flex-column align-items-center" style={styles}>
        {dataArray.length > 0 ? (
          dataArray.map((item, i) => <Card key={i} item={item} />)
        ) : (
          <BoldText
            style={{
              color: Colors.noNewsColor,
              fontSize: Fonts.noNewsText,
              marginTop: 30
            }}
          >
            Write Your First Post !!!
          </BoldText>
        )}
      </div>
    );
  }
}
