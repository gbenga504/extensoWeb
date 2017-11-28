import React from "react";
import styled from "styled-components";

import { RegularText, LightText } from "../../components/AppText";
import Fonts from "../../assets/Fonts";
import ContentCard from "../../components/ContentCard";
import DashboardHeader from "../../components/DashboardHeader";
import UserContentInformation from "../../components/UserContentInformation";

const Container = styled.div`padding: 20px 100px;`;
const CardContainer = styled.div`margin: 100px 0px;`;
const OtherContent = styled(ContentCard)`margin: 0px 20px;`;

export default class Content extends React.PureComponent {
  defaults = {
    headerIcon: [
      { name: "ion-edit", lastIcon: false },
      { name: "ion-ios-trash", lastIcon: true }
    ]
  };

  render() {
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <div className="d-flex">
          <Container className="d-flex flex-column">
            <UserContentInformation />
            <RegularText style={{ ...Fonts.content.title, marginTop: 20 }}>
              Thinking Compression (500mb to 20mb) Huh!
            </RegularText>
            <LightText style={{ ...Fonts.content.body, marginTop: 20 }}>
              Thinking compression is a series on how to achieve uptimum
              compression written by the author
            </LightText>
            <UserContentInformation hideDetails style={{ marginTop: 50 }} />
            <CardContainer className="d-flex justify-content-between">
              <OtherContent />
              <OtherContent />
            </CardContainer>
          </Container>
        </div>
      </div>
    );
  }
}
