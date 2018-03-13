import React from "react";
import PropTypes from "prop-types";

import SelectCategory from "../SelectCategory";

export default class Category extends React.PureComponent {
  static propTypes = {
    category: PropTypes.string.isRequired,
    onCategorySelected: PropTypes.func.isRequired
  };

  render() {
    let { category, onCategorySelected } = this.props;
    return (
      <div
        className="d-flex"
        style={{ margin: "10px 320px", marginBottom: "50px" }}
      >
        <SelectCategory
          title={category}
          onCategorySelected={onCategorySelected}
        />
      </div>
    );
  }
}
