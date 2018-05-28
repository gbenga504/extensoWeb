import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Router } from "react-kunyora";

import Card from "./Card";
import { BoldText } from "./AppText";
import Fonts from "../assets/Fonts";
import Colors from "../assets/Colors";
import { CircularSpinner } from "./Loaders";

export default class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: 2,
      hasNextPage: true
    };
    this.fetchMoreOnScroll();
  }

  static propTypes = {
    dataArray: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        short_content: PropTypes.string.isRequired,
        category: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        draft: PropTypes.bool,
        created_at: PropTypes.string.isRequired,
        likes_count: PropTypes.string,
        src: PropTypes.string
      }).isRequired
    ),
    onLoadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onNavigate: PropTypes.object.isRequired,
    reduxActions: PropTypes.object.isRequired,
    style: PropTypes.object,
    generalCategory: PropTypes.string
  };

  componentWillReceiveProps(nextProps) {
    let { generalCategory } = this.props;
    if (generalCategory != nextProps.generalCategory) {
      this.setState({
        pageCount: 2,
        hasNextPage: true
      });
    }
  }

  componentWillUnmount() {
    window.onscroll = null;
  }

  fetchMoreOnScroll = () => {
    window.onscroll = ev => {
      const GLOBAL_CONTAINER = document.getElementsByTagName("div")[0];
      if (
        window.scrollY + window.innerHeight >=
        GLOBAL_CONTAINER.scrollHeight
      ) {
        let { hasNextPage } = this.state;
        if (hasNextPage) {
          this.fetchMore(this.state.pageCount);
        } else {
          return;
        }
      }
    };
  };

  fetchMore = pageNumber => {
    let { onLoadMore, generalCategory } = this.props;
    onLoadMore({
      config: {
        params: { page: this.state.pageCount, category: generalCategory }
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.length === 0) {
          this.setState(prevState => ({
            hasNextPage: false
          }));
        } else {
          this.setState(prevState => ({
            pageCount: prevState.pageCount + 1
          }));
        }
        return [...previousResult, ...fetchMoreResult];
      }
    });
  };

  render() {
    const {
        dataArray,
        style,
        loading,
        onDelete,
        onNavigate,
        reduxActions
      } = this.props,
      styles = style
        ? { padding: "0px 320px", ...this.props.style }
        : { padding: "0px 320px" };

    return (
      <div className="d-flex flex-column align-items-center" style={styles}>
        {dataArray.length > 0 ? (
          dataArray.map((item, i) => (
            <Router
              key={i}
              name="content_router_link"
              loader={() => import("../views/Content")}
              onRequestRoute={() =>
                onNavigate.push(`/content/${item.id}?draft=${item.draft}`)
              }
              resources={[
                {
                  operation: "getAdminPosts",
                  fetchPolicy: "network-only",
                  config: {
                    ID: item.id,
                    params: { draft: item.draft }
                  }
                },
                { operation: "getAdminPosts", fetchPolicy: "cache-first" }
              ]}
            >
              {(routeState, fetchProgress, push) => (
                <Card
                  key={i}
                  item={item}
                  onDelete={onDelete}
                  onRequestRoute={push}
                  routeProgress={fetchProgress}
                  onNavigate={onNavigate}
                  reduxActions={reduxActions}
                />
              )}
            </Router>
          ))
        ) : (
          <img src="/images/writing.png" width="500px" height="500px" />
        )}
        {loading &&
          dataArray.length > 0 && <CircularSpinner size={30} thickness={5} />}
      </div>
    );
  }
}
