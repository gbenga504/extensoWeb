import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Card from "./Card";
import { BoldText } from "./AppText";
import Fonts from "../assets/Fonts";
import Colors from "../assets/Colors";
import { CircularSpinner } from "./Loaders";

export default class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: 1
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
        tags: PropTypes.string,
        draft: PropTypes.bool,
        created_at: PropTypes.string.isRequired,
        likes_count: PropTypes.string
      }).isRequired
    ),
    onLoadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onViewContent: PropTypes.func.isRequired,
    style: PropTypes.object
  };

  static childContextTypes = {
    onEdit: PropTypes.func,
    onViewContent: PropTypes.func,
    onDelete: PropTypes.func
  };

  getChildContext() {
    return {
      onEdit: this.props.onEdit,
      onViewContent: this.props.onViewContent,
      onDelete: this.props.onDelete
    };
  }

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
        this.props.onLoadMore(this.state.pageCount);
      }
    };
  };

  render() {
    const { dataArray, style, loading } = this.props,
      styles = style
        ? { padding: "0px 320px", ...this.props.style }
        : { padding: "0px 320px" };
        
    return (
      <div className="d-flex flex-column align-items-center" style={styles}>
        {dataArray.length > 0 ? (
          dataArray.map((item, i) => <Card key={i} item={item} />)
        ) : (
          <BoldText
            style={{
              color: Colors.noNewsColor,
              fontSize: Fonts.noNewsText,
              marginTop: 30
            }}
          >
            Write Your First Post !!!
          </BoldText>
        )}
        {loading && <CircularSpinner size={30} thickness={5} />}
      </div>
    );
  }
}
