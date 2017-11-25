import React from "react";
import styled from "styled-components";

import LayoutContainer from "../containers/LayoutContainer";


const Container = styled(LayoutContainer)`
  background: #f4f7fa;
  padding: 0;
`;

export default class MainThemeTemplate extends React.PureComponent {
  render() {
    return (
        <Container>
            
        </Container>
    )
  }
}
