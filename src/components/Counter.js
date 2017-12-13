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
const CATEGORIES = {
  category_count: "CATEGORIES",
  posts_count: "POSTS",
  likes_count: "LIKES"
};
const Counter = props => {
  return (
    <div className="d-flex">
      {Object.keys(props.items).map((item, i) => (
        <Section
          key={i}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <BoldText style={{ fontSize: "50px" }}>{props.items[item]}</BoldText>
          <BoldText style={{ fontSize: "13px" }}>{CATEGORIES[item]}</BoldText>
        </Section>
      ))}
    </div>
  );
};

Counter.propTypes = {
  items: PropTypes.shape({
    category_count: PropTypes.string,
    posts_count: PropTypes.string,
    likes_count: PropTypes.string
  })
};
export default Counter;
