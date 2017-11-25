import React from "react";
import styled from "styled-components";

import Colors from "../assets/Colors";
import Icon from "./Icon";
import Input from "./Input";

const Div = styled.div`
  background: ${Colors.dashboardHeader.background};
  border-bottom: 1px solid ${Colors.dashboardHeader.border};
  height: 70px;
`;
const Section = styled.div`
  width: 70px;
  height: 70px;
  cursor: pointer;
  border-right: 1px solid ${Colors.dashboardHeader.border};
  background: ${props =>
    props.active
      ? Colors.dashboardHeader.sectionActive
      : Colors.dashboardHeader.sectionUnactive};
  &:hover: {
  }
`;
const SearchBox = Input.extend`height: 100%;`;

const DashboardHeader = props => (
  <Div {...props} className="d-flex" style={{ width: "100%" }}>
    <Section className="d-flex flex-column justify-content-center align-items-center">
      <Icon className="ion-ios-settings-strong" />
    </Section>
    <Section
      style={{ borderRight: `1px solid #fff` }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <Icon className="ion-ios-search-strong" />
    </Section>
    <SearchBox
      type="search"
      placeholder="Search for a post from the categories"
    />
    {props.iconArray &&
      props.iconArray.map((icon, index) => (
        <Section
          key={index}
          style={
            icon.lastIcon && {
              borderLeft: `1px solid ${Colors.dashboardHeader.border}`
            }
          }
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon className={icon.name} />
        </Section>
      ))}
  </Div>
);

export default DashboardHeader;
