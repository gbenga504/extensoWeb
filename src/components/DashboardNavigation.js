import React from "react";
import styled from "styled-components";

import { RegularText } from "./AppText";
import Icon from "./Icon";
import Colors from "../assets/Colors";

const Container = styled.div`
  width: 70px;
  position: fixed;
  height: 100%;
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

  &:hover {
    background: ${props =>
      props.active
        ? Colors.dashboardNav.hover
        : Colors.dashboardNav.sectionUnactive};
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
  static defaults = {
    path: [
      { pathName: "/", title: "Home", iconName: "ion-ios-home-outline" },
      { pathName: "/post/", title: "Post", iconName: "ion-ios-compose-outline" },
      {
        pathName: "/drafts",
        title: "Drafts",
        iconName: "ion-ios-bookmarks-outline"
      },
      {
        pathName: "/sections",
        title: "Sections",
        iconName: "ion-ios-paper-outline"
      }
    ]
  };

  render() {
    return (
      <Container className="d-flex flex-column">
        {DashboardNavigation.defaults.path.map((path, i) => {
          let isActive = path.pathName === this.props.location.pathname,
            color = isActive
              ? Colors.dashboardNav.iconActive
              : Colors.dashboardNav.iconUnactive;
          return (
            <Section
              onClick={() => this.props.history.push(path.pathName)}
              key={i}
              active={isActive}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <Icon
                className={path.iconName}
                forceColor={true}
                size="30px"
                style={{ color }}
              />
              <Title active={isActive}>{path.title}</Title>
            </Section>
          );
        })}
      </Container>
    );
  }
}
