import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Card from "../../components/Card";
import { RegularText } from "../../components/AppText";
import Fonts from "../../assets/Fonts";
import { CircularSpinner } from "../../components/Loaders";
import ContentPadder from "../../containers/ContentPadder";

export default class Search extends React.PureComponent {
  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true, segmentName: "logout" }]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <ContentPadder className="flex-column">
          <div className="d-flex flex-column" style={{ padding: "0px 320px" }}>
            <div className="d-flex" style={{ marginTop: 50 }}>
              <RegularText style={Fonts.search.title}>
                Showing 45 results for "Innovation" category
              </RegularText>
            </div>
            <div className="d-flex flex-column align-items-center">
              <Card />
              <Card />
              <CircularSpinner style={{ marginTop: 50 }} />
            </div>
          </div>
        </ContentPadder>
      </div>
    );
  }
}