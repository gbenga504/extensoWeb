import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import "./index.css";

export default class ToolTip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.toolTip = document.createElement("span");
    this.toolTip.className = `data-tooltip-message ${props.dataPosition}`;
  }

  static propTypes = {
    dataPosition: PropTypes.string,
    title: PropTypes.string
  };

  componentDidMount() {
    setTimeout(() => {
      let tooltip = document.getElementsByClassName("data-tooltip")[0];
      tooltip.appendChild(this.toolTip);
    }, 1);
  }

  componentWillUnmount() {
    let tooltip = document.getElementsByClassName("data-tooltip")[0];
    tooltip.removeChild(this.toolTip);
  }

  render() {
    return ReactDOM.createPortal(this.props.title, this.toolTip);
  }
}
