import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Input from "./Input";

const SearchBox = Input.extend`
  height: 100%;
  font-size: 16px;
`;

export default class DashboardSeacrhBox extends React.PureComponent {
  static propTypes = {
    onTextChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    onKeyPress: PropTypes.func.isRequired,
    fetchProgress: PropTypes.any,
    sendFetchProgressToRedux: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    let { fetchProgress, sendFetchProgressToRedux } = this.props;
    if (nextProps.fetchProgress !== fetchProgress) {
      sendFetchProgressToRedux(nextProps.fetchProgress);
    }
  }

  render() {
    let { value, onTextChange, onKeyPress } = this.props;
    return (
      <SearchBox
        className="d-flex align-self-center"
        type="search"
        value={value}
        onChange={onTextChange}
        onKeyPress={onKeyPress}
        placeholder="Search for a post from the categories"
      />
    );
  }
}
