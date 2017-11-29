import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Card from "../../components/Card";
import { RegularText } from "../../components/AppText";
import Fonts from "../../assets/Fonts";

export default class Search extends React.PureComponent {
  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true }]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <div className="d-flex flex-column" style={{ padding: "0px 320px" }}>
          <div className="d-flex" style={{ marginTop: 50 }}>
            <RegularText style={Fonts.search.title}>
              Showing 45 results for "Innovation" category
            </RegularText>
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
