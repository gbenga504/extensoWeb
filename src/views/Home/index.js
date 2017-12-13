import React from "react";

import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import Card from "../../components/Card";
import ContentPadder from "../../containers/ContentPadder";
import { composer } from "../../containers/composer";
import { CircularSpinner } from "../../components/Loaders";

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

  componentDidUpdate() {
    console.log(this.props);
  }

  renderActualData = () => {
    let { all_news: { result }, likes_count } = this.props;
    return (
      <ContentPadder className="flex-column">
        <Counter
          items={(likes_count.result && likes_count.result.message[0]) || {}}
        />
        <div
          className="d-flex flex-column align-items-center"
          style={{ padding: "0px 320px" }}
        >
          {result && result.message && result.message.length !== 0 ? (
            <Card />
          ) : (
            <span>No data </span>
          )}
        </div>
      </ContentPadder>
    );
  };

  render() {
    let { all_news: { loading, isInitialDataSet } } = this.props;
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        {!isInitialDataSet && loading ? (
          <CircularSpinner
            size={50}
            className="align-self-center"
            style={{ marginTop: 200 }}
          />
        ) : (
          this.renderActualData()
        )}
      </div>
    );
  }
}

const HomeWithData = composer("get", {
  name: "all_news",
  options: props => ({
    variables: {
      url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/9"
    },
    fetchPolicy: "network-only"
  })
})(
  composer("get", {
    name: "likes_count",
    options: props => ({
      variables: {
        url: "https://agro-extenso.herokuapp.com/api/v1/post-count/all/"
      }
    })
  })(Home)
);

export default HomeWithData;
