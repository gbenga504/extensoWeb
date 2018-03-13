import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Router } from "react-composer";

import Card from "./Card";
import { BoldText } from "./AppText";
import Fonts from "../assets/Fonts";
import Colors from "../assets/Colors";
import { CircularSpinner } from "./Loaders";

export default class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: 1,
      hasNextPage: true
    };
    this.fetchMoreOnScroll();
  }

  static propTypes = {
    dataArray: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        category: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        draft: PropTypes.bool,
        created_at: PropTypes.string.isRequired,
        likes_count: PropTypes.string
      }).isRequired
    ),
    onLoadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onNavigate: PropTypes.func.isRequired,
    reduxActions: PropTypes.object.isRequired,
    style: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.dataArray, this.props.dataArray)) {
      this.setState({ pageCount: this.state.pageCount + 1 });
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
    let { onLoadMore } = this.props;
    onLoadMore({
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.length === 0) {
          this.setState({ hasNextPage: false });
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
              name="content_router_link"
              loader={() => import("../views/Content")}
              onRequestRoute={() => onNavigate.push(`/content/${item.id}`)}
              resources={[
                { operation: "getAdminPosts", fetchPolicy: "network-only" },
                { operation: "getAdminPosts", fetchPolicy: "network-only" }
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
