import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ProgressContainer = styled.div`
  position: fixed;
  width: 100%;
  background: #e0e0e0;
  height: 3px;
  z-index: 1000001;
`;

export default class IndefiniteProgressBar extends React.PureComponent {
  state = {
    left: -80
  };

  static default = {
    leftAdder: -80
  };

  static propTypes = {
    color: PropTypes.string
  };

  static defaultProps = {
    color: "#1976d2"
  };

  componentDidMount() {
    this.performAnimationCalculations();
  }

  componentWillUnmount() {
    this.animation = undefined;
  }

  performAnimationCalculations = () => {
    let start = window.performance.now(),
      duration = 1000;
    let self = this;
    this.animation = requestAnimationFrame(function animate(time) {
      if (self.animation === undefined) {
        return;
      }
      let movement = (time - start) / duration;
      if (movement >= 1) {
        movement = 1;
        self.drawAnimation(movement);
        start = window.performance.now();
      } else {
        self.drawAnimation(movement);
      }
      requestAnimationFrame(animate);
    });
  };

  drawAnimation = movement => {
    let left =
      IndefiniteProgressBar.default.leftAdder + Math.pow(movement, 2) * 180;
    this.setState({ left });
  };

  render() {
    return (
      <ProgressContainer>
        <div
          style={{
            left: `${this.state.left}%`,
            ...styles.progress,
            backgroundColor: `${this.props.color}`
          }}
        />
      </ProgressContainer>
    );
  }
}

const styles = {
  progress: {
    position: "fixed",
    top: "0px",
    width: "80%",
    height: "3px",
    zIndex: 999999
  }
};
