import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import ContentPadder from "../../containers/ContentPadder";
import Counter from "../../components/Counter";
import Card from "../../components/Card";

export default class Drafts extends React.PureComponent {
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
          <Counter items={Drafts.seedData.items} />
          <div
            className="d-flex flex-column align-items-center"
            style={{ padding: "0px 320px" }}
          >
            <Card hideLikes />
            <Card hideLikes />
          </div>
        </ContentPadder>
      </div>
    );
  }
}
