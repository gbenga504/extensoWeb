import React from "react";
import PropTypes from "prop-types";

import Colors from "../assets/Colors";

export default class LayoutContainer extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.string
  };

  static childContextTypes = {
    themecolor: PropTypes.string
  };

  getChildContext() {
    return {
      themecolor: this.getThemeColor()
    };
  }

  getThemeColor = () => {
    const { color } = this.props;
    if (color != null && typeof color !== "undefined") {
      return color || Colors.defaultThemeColor;
    }
    return null;
  };

  render() {
    return (
      <div
        className={`d-flex ${this.props.className || ""}`}
        style={{ height: "100%" }}
      >
        {this.props.children}
      </div>
    );
  }
}
