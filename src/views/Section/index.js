import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import Card from "../../components/Card";
import SelectCategory from "../../components/Section/SelectCategory";

export default class Section extends React.PureComponent {
  static seedData = {
    items: [{ number: 15, tag: "POSTS" }]
  };

  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true }]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <Counter items={Section.seedData.items} />
        <div className="d-flex flex-column" style={{ padding: "0px 320px" }}>
          <div className="d-flex" style={{ marginTop: 50 }}>
            <SelectCategory />
          </div>
          <div className="d-flex flex-column align-items-center">
            <Card />
            <Card />
          </div>
        </div>
      </div>
    );
  }
}
