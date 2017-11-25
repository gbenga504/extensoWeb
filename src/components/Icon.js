import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

class I extends React.PureComponent {
  static contextTypes = {
    themecolor: PropTypes.string
  };

  composeStyle = () => {
    if (this.props.forceColor) {
      return this.props.style;
    }
    return { ...this.props.style, color: this.context.themecolor };
  };

  render() {
    return <i {...this.props} style={this.composeStyle()} />;
  }
}

const Icon = styled(I)`font-size: ${props => props.size || "20px"};`;

export default Icon;
