import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const ProgressBar = styled.div`
  position: fixed;
  top: 0px;
  height: 3px;
  width: ${props => props.progress}%;
  display: ${props => (props.progress < 100 ? "block" : "none")};
  z-index: 1000001;
  background: #1976d2;
`;
const ProgressContainer = styled.div`
  position: fixed;
  width: 100%;
  background: #e0e0e0;
  display: ${props => (props.progress < 100 ? "block" : "none")};
  height: 3px;
  z-index: 1000001;
`;

const DefiniteProgressBar = props => (
  <ProgressContainer progress={props.progress}>
    <ProgressBar progress={props.progress} />
  </ProgressContainer>
);

DefiniteProgressBar.propTypes = {
  progress: PropTypes.number
};

export default DefiniteProgressBar;
