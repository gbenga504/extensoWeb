import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class I extends React.PureComponent {
  static contextTypes = {
    themeColor: PropTypes.string
  };

  static propTypes = {
    forceColor: PropTypes.bool,
    size: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
  };

  composeStyle = () => {
    if (this.props.forceColor) {
      return this.props.style;
    }
    return { ...this.props.style, color: this.context.themeColor };
  };

  render() {
    return <i className={this.props.className} style={this.composeStyle()} />;
  }
}

const Icon = styled(I)`font-size: ${props => props.size || "20px"};`;

export default Icon;
