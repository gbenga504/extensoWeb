import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Home/Counter";
import Card from "../../components/Card";

export default class Home extends React.PureComponent {
  static seedData = {
    items: [
      { number: 15, tag: "POSTS" },
      { number: 4, tag: "CATEGORIES" },
      { number: 300, tag: "LIKES" }
    ]
  };

  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true }]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <Counter items={Home.seedData.items} />
        <div
          className="d-flex flex-column align-items-center"
          style={{ padding: "0px 320px" }}
        >
          <Card />
          <Card />
        </div>
      </div>
    );
  }
}
