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
    className: PropTypes.string,
    onClick: PropTypes.func
  };

  composeStyle = () => {
    if (this.props.forceColor) {
      return this.props.style;
    }
    return { ...this.props.style, color: this.context.themeColor };
  };

  runOnClick = ev => {
    let { onClick } = this.props;
    if (onClick) {
      ev.stopPropagation();
      onClick();
    } else {
      return null;
    }
  };

  render() {
    return (
      <i
        className={this.props.className}
        onClick={this.runOnClick}
        style={this.composeStyle()}
      />
    );
  }
}

const Icon = styled(I)`font-size: ${props => props.size || "20px"};`;

export default Icon;
