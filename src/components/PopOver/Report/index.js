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
    message: PropTypes.string
  };

  componentDidUpdate() {
    window.setTimeout(() => {
      this.report.style.top = "20px";
      window.setTimeout(() => {
        this.report.style.top = "-60px";
      }, 3000);
    }, 1);
  }

  render() {
    return (
      <div className="report" ref={ref => (this.report = ref)}>
        <LightText className="reportText">"{this.props.message}"</LightText>
      </div>
    );
  }
}
