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
  determineActiveState = title => {
    let p = new RegExp(`/${title.toLowerCase()}/{0,1}`, "gi"),
      isActive = p.test(this.props.location.pathname),
      color = isActive
        ? Colors.dashboardNav.iconActive
        : Colors.dashboardNav.iconUnactive;
    return { color, isActive };
  };

  render() {
    let colorForHome =
      window.location.pathname === "/"
        ? Colors.dashboardNav.iconActive
        : Colors.dashboardNav.iconUnactive;

    return (
      <Container className="d-flex flex-column">
        <Section
          onClick={() => this.props.history.push("/")}
          active={window.location.pathname === "/"}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon
            className="ion-ios-home-outline"
            forceColor={true}
            size="30px"
            style={{ color: colorForHome }}
          />
          <Title active={window.location.pathname === "/"}>Home</Title>
        </Section>

        <Section
          onClick={() => this.props.history.push("/post/")}
          active={this.determineActiveState("Post").isActive}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon
            className="ion-ios-compose-outline"
            forceColor={true}
            size="30px"
            style={{ color: this.determineActiveState("Post").color }}
          />
          <Title active={this.determineActiveState("Post").isActive}>
            Post
          </Title>
        </Section>

        <Section
          onClick={() => this.props.history.push("/drafts/")}
          active={this.determineActiveState("Drafts").isActive}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon
            className="ion-ios-bookmarks-outline"
            forceColor={true}
            size="30px"
            style={{ color: this.determineActiveState("Drafts").color }}
          />
          <Title active={this.determineActiveState("Drafts").isActive}>
            Drafts
          </Title>
        </Section>

        <Section
          onClick={() => this.props.history.push("/sections/all")}
          active={this.determineActiveState("Sections").isActive}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Icon
            className="ion-ios-paper-outline"
            forceColor={true}
            size="30px"
            style={{ color: this.determineActiveState("Sections").color }}
          />
          <Title active={this.determineActiveState("Sections").isActive}>
            Sections
          </Title>
        </Section>
      </Container>
    );
  }
}
