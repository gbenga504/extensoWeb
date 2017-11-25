import React from "react";
import styled from "styled-components";

import { RegularText } from "./AppText";
import Icon from "./Icon";

const Container = styled.div`
  width: 70px;
  background-color: #2f323e;
  border-right: 1px solid #262a34;
`;
const Section = styled.div`
  width: 70px;
  height: 70px;
  cursor: pointer;
  background: ${props => (props.active ? "#E95656" : "#2f323e")};

  &:hover: {
  }
`;
const Title = styled(RegularText)`
  font-size: 13px;
  color: ${props => (props.active ? "#fff" : "#535C69")};
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
            style={{ color: "#fff" }}
          />
          <Title active>Home</Title>
        </Section>
        <Section className="d-flex flex-column justify-content-center align-items-center">
          <Icon
            className="ion-ios-compose-outline"
            forceColor={true}
            size="30px"
            style={{ color: "#535C69" }}
          />
          <Title>Post</Title>
        </Section>
        <Section className="d-flex flex-column justify-content-center align-items-center">
          <Icon
            className="ion-ios-bookmarks-outline"
            forceColor={true}
            size="30px"
            style={{ color: "#535C69" }}
          />
          <Title>Drafts</Title>
        </Section>
        <Section className="d-flex flex-column justify-content-center align-items-center">
          <Icon
            className="ion-ios-paper-outline"
            forceColor={true}
            size="30px"
            style={{ color: "#535C69" }}
          />
          <Title>Sections</Title>
        </Section>
      </Container>
    );
  }
}
