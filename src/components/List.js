import React from "react";
import PropTypes from "prop-types";

import Card from "./Card";

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
    style: PropTypes.object,
    renderNullItem: PropTypes.element
  };

  render() {
    const { dataArray, renderNullItem, style } = this.props,
      styles = style
        ? { padding: "0px 320px", ...this.props.style }
        : { padding: "0px 320px" };

    return (
      <div className="d-flex flex-column align-items-center" style={styles}>
        {dataArray.length > 0
          ? dataArray.map((item, i) => <Card key={i} item={item} />)
          : renderNullItem}
      </div>
    );
  }
}
