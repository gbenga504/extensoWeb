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
    console.log("i mounted", this.props);
  }

  componentDidUpdate() {
    console.log("i updated", this.props);
  }

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <ContentPadder className="flex-column">
          <Counter items={Home.seedData.items} />
          <button onClick={() => this.props.push({ goto: "/content" })}>
            refresh content
          </button>
          <div
            className="d-flex flex-column align-items-center a"
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

const HomeWithData = composer("push", {
  name: "pusher",
  options: props => ({
    variables: {
      url: "google.com",
      timeout: props.currentUser
    }
  })
  // props: ({ home_post: { loading }, mutate }) => ({
  //   isLoading: loading,
  //   mutation: mutate
  // })
})(Home);

// const HomeWithData = composer("get", {
//   name: "home_get",
//   options: props => ({
//     variables: {
//       url: "google.com",
//       timeout: props.currentUser
//     }
//   }),
//   props: ({ home_get: { refetchQuery, fetchMore, error }, currentUser }) => ({
//     refetcher: refetchQuery,
//     error,
//     fetchMoreData: () => {
//       return fetchMore({
//         variables: { url: "babalowo.com" },
//         updateQuery: (previousResult, { fetchMoreResult }) => {}
//       });
//     }
//   })
// })(Home);

function mapStateToProps(state) {
  return { currentUser: 5 };
}

export default connect(mapStateToProps)(HomeWithData);
