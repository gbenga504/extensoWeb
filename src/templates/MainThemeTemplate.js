import React from "react";
import styled from "styled-components";

import LayoutContainer from "../containers/LayoutContainer";
import DashboardNavigation from "../components/DashboardNavigation";
import Colors from "../assets/Colors";

const Container = styled(LayoutContainer)`
  background: ${Colors.defaultThemeColor};
  padding: 0;
`;

export default class MainThemeTemplate extends React.PureComponent {
  render() {
    return (
      <Container>
        <DashboardNavigation />
      </Container>
    );
  }
}
