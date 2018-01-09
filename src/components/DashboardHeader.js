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
const SearchBox = Input.extend`
  height: 100%;
  font-size: 16px;
`;

class DashboardHeader extends React.PureComponent {
  state = {
    value: ""
  };

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
    onSearch: PropTypes.func,
    searchValue: PropTypes.string
  };

  componentDidMount() {
    let { searchValue } = this.props;
    if (searchValue) {
      this.setState({ value: searchValue });
    }
  }

  search = ev => {
    let { which, keyCode, target: { value } } = ev;
    if ((which === 13 || keyCode === 13) && value.trim().length > 0) {
      let { onSearch } = this.props;
      onSearch && onSearch(value);
    }
  };

  render() {
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
            <SearchBox
              className="d-flex align-self-center"
              type="search"
              value={this.state.value}
              onChange={ev => this.setState({ value: ev.target.value })}
              onKeyPress={this.search}
              placeholder="Search for a post from the categories"
            />
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

export default DashboardHeader;
