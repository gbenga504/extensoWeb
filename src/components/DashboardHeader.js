import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Router } from "react-composer";

import Colors from "../assets/Colors";
import Icon from "./Icon";
import { GeneralBasedUtils } from "../utils/index";
import DashboardSearchBox from "./DashboardSearchBox";

const Div = styled.div`
  background: ${Colors.dashboardHeader.background};
  border-bottom: 1px solid ${Colors.dashboardHeader.border};
  height: 70px;
  position: fixed;
  width: 100%;
  z-index: 1000000;
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

export default class DashboardHeader extends React.PureComponent {
  constructor(props) {
    super(props);
    let { searchValue } = props;
    this.state = {
      value: searchValue || ""
    };
  }

  static propTypes = {
    iconArray: PropTypes.arrayOf(
      PropTypes.shape({
        lastIcon: PropTypes.bool,
        name: PropTypes.string.isRequired,
        segmentName: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        cursorAllowed: PropTypes.bool
      })
    ),
    hideSearch: PropTypes.bool,
    onNavigate: PropTypes.object,
    searchValue: PropTypes.string,
    onSetDraftState: PropTypes.func,
    isContentDraftBased: PropTypes.bool,
    reduxActions: PropTypes.object.isRequired
  };

  search = (ev, push) => {
    let { which, keyCode, target: { value } } = ev;
    if ((which === 13 || keyCode === 13) && value.trim().length > 0) {
      this.props.onSetDraftState(this.props.isContentDraftBased);
      push();
    }
  };

  //@Todo, update a state called params with the result of this when the user changes the input field and on component Mount
  generateQueryParams = () => {
    let { value } = this.state;
    return value.indexOf("#") === -1
      ? value
      : GeneralBasedUtils.formaHashTagUrlForSearch(value).urlParams;
  };

  render() {
    let { value } = this.state,
      {
        onNavigate,
        reduxActions: { setPageHandshakeProgress },
        isContentDraftBased
      } = this.props;
    return (
      <Div className="d-flex">
        {!this.props.hideSearch ? (
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
            <Router
              name="search_router_link"
              loader={() => import("../views/Search")}
              onRequestRoute={() =>
                onNavigate.push(`/search/?q=${window.encodeURI(value)}`)
              }
              resources={[
                {
                  operation: "getAdminPosts",
                  fetchPolicy: "network-only",
                  config: { params: { q: value, draft: isContentDraftBased } }
                }
              ]}
            >
              {(routeState, fetchProgress, push) => (
                <DashboardSearchBox
                  value={value}
                  fetchProgress={fetchProgress}
                  sendFetchProgressToRedux={setPageHandshakeProgress}
                  onTextChange={ev =>
                    this.setState({ value: ev.target.value.trim() })
                  }
                  onKeyPress={ev => this.search(ev, push)}
                />
              )}
            </Router>
          </div>
        ) : (
          <div className="d-flex" style={{ width: "100%" }} />
        )}

        {this.props.iconArray &&
          this.props.iconArray.map((icon, index) => (
            <Section
              key={index}
              onClick={icon.onClick}
              name={icon.segmentName}
              style={
                icon.lastIcon
                  ? {
                      borderLeft: `1px solid ${Colors.dashboardHeader.border}`,
                      marginRight: 70,
                      cursor:
                        icon.cursorAllowed || icon.cursorAllowed === undefined
                          ? "pointer"
                          : "not-allowed"
                    }
                  : {}
              }
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <Icon
                forceColor
                className={icon.name}
                style={{ color: "#fff" }}
              />
            </Section>
          ))}
      </Div>
    );
  }
}
