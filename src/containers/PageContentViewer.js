import React from "react";
import PropTypes from "prop-types";

import { CircularSpinner } from "../components/Loaders";

export default class PageContentViewer extends React.PureComponent {
  state = { height: "auto" };

  static propTypes = {
    error: PropTypes.bool,
    loading: PropTypes.bool,
    renderItem: PropTypes.element.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading || nextProps.error) {
      this.setState({ height: `${window.innerHeight}px` });
    } else {
      this.setState({ height: "auto" });
    }
  }

  renderLoadingOrError = component => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      {component}
    </div>
  );

  render() {
    let { error, loading, renderItem } = this.props,
      { height } = this.state;

    return (
      <div className="d-flex" style={{ height }}>
        <div className="d-flex flex-column" style={{ width: "100%" }}>
          {loading
            ? this.renderLoadingOrError(
                <CircularSpinner
                  thickness={10}
                  size={50}
                  className="align-self-center"
                />
              )
            : error
              ? this.renderLoadingOrError(<span>error in loading</span>)
              : renderItem}
        </div>
      </div>
    );
  }
}
