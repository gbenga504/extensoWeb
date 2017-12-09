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
  background: #66bb6a;
`;

const DefiniteProgressBar = props => <ProgressBar progress={props.progress} />;

DefiniteProgressBar.propTypes = {
  progress: PropTypes.number
};

export default DefiniteProgressBar;
