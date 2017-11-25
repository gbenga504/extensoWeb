import React from "react";

import DashboardHeader from "../../components/DashboardHeader";

export default class Home extends React.PureComponent {
  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true }]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
      </div>
    );
  }
}
