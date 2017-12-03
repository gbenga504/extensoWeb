import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import Card from "../../components/Card";
import SelectCategory from "../../components/SelectCategory";
import ContentPadder from "../../containers/ContentPadder";

export default class Section extends React.PureComponent {
  static seedData = {
    items: [{ number: 15, tag: "POSTS" }]
  };

  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true, segmentName: "logout" }]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <ContentPadder className="flex-column">
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
        </ContentPadder>
      </div>
    );
  }
}
