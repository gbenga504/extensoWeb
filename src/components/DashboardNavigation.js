import React from "react";
import styled from "styled-components";

import { RegularText } from "./AppText";
import Icon from "./Icon";
import Colors from "../assets/Colors";

const Container = styled.div`
  width: 70px;
  background-color: ${Colors.dashboardNav.background};
  border-right: 1px solid ${Colors.dashboardNav.border};
`;
const Section = styled.div`
  width: 70px;
  height: 70px;
  cursor: pointer;
  background: ${props =>
    props.active
      ? Colors.dashboardNav.sectionActive
      : Colors.dashboardNav.sectionUnactive};

  &:hover: {
  }
`;
const Title = styled(RegularText)`
  font-size: 13px;
  color: ${props =>
    props.active
      ? Colors.dashboardNav.titleActive
      : Colors.dashboardNav.titleUnactive};
  margin-top: -10px;
`;

export default class DashboardNavigation extends React.PureComponent {
  render() {
    return (
      <Container className="d-flex flex-column">
        <Section
          active
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon
            className="ion-ios-home-outline"
            forceColor={true}
            size="30px"
            style={{ color: Colors.dashboardNav.iconActive }}
          />
          <Title active>Home</Title>
        </Section>
        <Section className="d-flex flex-column justify-content-center align-items-center">
          <Icon
            className="ion-ios-compose-outline"
            forceColor={true}
            size="30px"
            style={{ color: Colors.dashboardNav.iconUnactive }}
          />
          <Title>Post</Title>
        </Section>
        <Section className="d-flex flex-column justify-content-center align-items-center">
          <Icon
            className="ion-ios-bookmarks-outline"
            forceColor={true}
            size="30px"
            style={{ color: Colors.dashboardNav.iconUnactive }}
          />
          <Title>Drafts</Title>
        </Section>
        <Section className="d-flex flex-column justify-content-center align-items-center">
          <Icon
            className="ion-ios-paper-outline"
            forceColor={true}
            size="30px"
            style={{ color: Colors.dashboardNav.iconUnactive }}
          />
          <Title>Sections</Title>
        </Section>
      </Container>
    );
  }
}
