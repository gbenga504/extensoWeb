import React from "react";
import styled, { keyframes } from "styled-components";

import Colors from "../../assets/Colors";

const Container = styled.div`
  width: 100%;
  margin-left: 0px;
  margin-top: 0px;
  height: 3px;
`;
const translateRainbow = keyframes`
  0% {transform: translateX(-90%)}
  100%{transform: translateX(0%)}
`;
const ColorPigment = styled.div`
  width: 100%;
  background: linear-gradient(
    90deg,
    ${props => Colors.rainbowLoader.gradient[props.pigmentName]},
    ${props => Colors.rainbowLoader.blender[props.pigmentName]},
    ${props => Colors.rainbowLoader[props.pigmentName]},
    ${props => Colors.rainbowLoader.blender[props.pigmentName]},
    ${props => Colors.rainbowLoader.gradient[props.pigmentName]}
  );
  animation: ${translateRainbow} 1s infinite;
`;

const Rainbows = ["red", "orange", "yellow", "green", "blue", "indigo"];

export default props => (
  <Container className="d-flex">
    {Rainbows.map((pigmentName, i) => (
      <ColorPigment className="d-flex" key={i} pigmentName={pigmentName} />
    ))}
  </Container>
);
