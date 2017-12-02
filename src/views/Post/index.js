import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Form from "../../components/Post/Form";

export default class Post extends React.PureComponent {
  state = {
    height: window.innerHeight
  };

  defaults = {
    headerIcon: [{ name: "ion-paper-airplane", lastIcon: true }]
  };

  render() {
    return (
      <div
        className="d-flex flex-column"
        style={{ width: "100%", height: "auto" }}
      >
        <DashboardHeader hideSearch iconArray={this.defaults.headerIcon} />
        <Form />
      </div>
    );
  }
}
