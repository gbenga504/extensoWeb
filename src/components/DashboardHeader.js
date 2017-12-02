import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

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
  background: ${props => Colors.dashboardHeader[props.name]};
  &:hover {
    background: ${props => Colors.dashboardHeader.hover[props.name]};
  }
`;
const SearchBox = Input.extend`height: 100%;`;

const DashboardHeader = props => (
  <Div className="d-flex" style={{ width: "100%" }}>
    {!props.hideSearch ? (
      <div className="d-flex" style={{ width: "100%" }}>
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
          className="d-flex align-self-center"
          type="search"
          placeholder="Search for a post from the categories"
        />
      </div>
    ) : (
      <div className="d-flex" style={{ width: "100%" }} />
    )}

    {props.iconArray &&
      props.iconArray.map((icon, index) => (
        <Section
          key={index}
          name={icon.segmentName}
          style={
            icon.lastIcon
              ? {
                  borderLeft: `1px solid ${Colors.dashboardHeader.border}`
                }
              : {}
          }
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon forceColor className={icon.name} style={{ color: "#fff" }} />
        </Section>
      ))}
  </Div>
);

DashboardHeader.propTypes = {
  iconArray: PropTypes.arrayOf(
    PropTypes.shape({
      lastIcon: PropTypes.bool,
      name: PropTypes.string.isRequired,
      segmentName: PropTypes.string.isRequired
    })
  ),
  hideSearch: PropTypes.bool
};

export default DashboardHeader;
