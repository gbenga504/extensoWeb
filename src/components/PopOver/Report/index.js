import React from "react";
import PropTypes from "prop-types";

import { LightText } from "../../AppText";
import "./index.css";

/**
 * @Component Success renders a success tool-tip like notifier to the user
 */
export default class Report extends React.PureComponent {
  static propTypes = {
    id: PropTypes.number,
    message: PropTypes.string,
    type: PropTypes.string
  };

  componentDidUpdate() {
    window.setTimeout(() => {
      this.report.style.top = "0px";
      window.setTimeout(() => {
        this.report.style.top = "-60px";
      }, 3000);
    }, 1);
  }

  render() {
    let { message, type } = this.props,
      background = type == "error" ? "#cc5454" : "#616161";
    return (
      <div
        className="report"
        style={{ background }}
        ref={ref => (this.report = ref)}
      >
        <LightText className="reportText" style={{ color: "#fff" }}>
          {this.props.message}
        </LightText>
      </div>
    );
  }
}
