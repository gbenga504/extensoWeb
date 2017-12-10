import React from "react";

import { connect } from "react-redux";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import Card from "../../components/Card";
import ContentPadder from "../../containers/ContentPadder";
import { composer } from "../../containers/composer";

class Home extends React.PureComponent {
  static seedData = {
    items: [
      { number: 15, tag: "POSTS" },
      { number: 4, tag: "CATEGORIES" },
      { number: 300, tag: "LIKES" }
    ]
  };

  defaults = {
    headerIcon: [{ name: "ion-power", lastIcon: true, segmentName: "logout" }]
  };

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <ContentPadder className="flex-column">
          <Counter items={Home.seedData.items} />
          <div
            className="d-flex flex-column align-items-center"
            style={{ padding: "0px 320px" }}
          >
            <Card />
            <Card />
          </div>
        </ContentPadder>
      </div>
    );
  }
}

const HomeWithData = composer("Push", {
  name: "home_push",
  options: { variables: { url: "http://www.facebook.com" } },
  props: ({ push }) => ({
    pusher: variables => push({}, "maria")
  })
})(
  composer("get", {
    name: "home_get",
    options: props => ({
      variables: {
        url: "google.com",
        timeout: props.currentUser
      }
    })
  })(Home)
);

function mapStateToProps(state) {
  return { currentUser: 5 };
}

export default connect(mapStateToProps)(HomeWithData);
