import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { BoldText } from "./AppText";
import Colors from "../assets/Colors";

const Section = styled.div`
  height: 200px;
  width: 200px;
  border-right: 1px solid ${Colors.home.counterBorder};
  border-bottom: 1px solid ${Colors.home.counterBorder};
`;

const Counter = props => (
  <div className="d-flex">
    {props.items.map((item, i) => (
      <Section
        key={i}
        className="d-flex flex-column justify-content-center align-items-center"
      >
        <BoldText style={{ fontSize: "50px" }}>{item.number}</BoldText>
        <BoldText style={{ fontSize: "13px" }}>{item.tag}</BoldText>
      </Section>
    ))}
  </div>
);

Counter.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      tag: PropTypes.string.isRequired
    })
  )
};
export default Counter;
