import React from "react";

import List from "../../components/List";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";
import { composer } from "../../containers/composer";

class Home extends React.PureComponent {
  generateHeaderIcon = () => [
    {
      name: "ion-power",
      lastIcon: true,
      segmentName: "logout",
      onClick: this.logout
    }
  ];

  logout = () => {
    localStorage.removeItem("jwt");
    let { history: { push } } = this.props;
    push("/login");
  };

  renderActualData = () => {
    let { all_news: { result }, likes_count } = this.props,
      dataArray = (result && result.message) || [];
    return (
      <ContentPadder className="flex-column">
        <Counter
          items={(likes_count.result && likes_count.result.message[0]) || {}}
        />
        <List dataArray={dataArray} />
      </ContentPadder>
    );
  };

  render() {
    let { all_news: { loading, isInitialDataSet, error } } = this.props,
      errorStatus = (error && true) || false;
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.generateHeaderIcon()} />
        <PageContentViewer
          loading={!isInitialDataSet && loading}
          error={!isInitialDataSet && errorStatus}
          renderItem={this.renderActualData()}
        />
      </div>
    );
  }
}

const HomeWithData = composer("get", {
  name: "all_news",
  options: props => ({
    variables: {
      url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/9"
    }
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
