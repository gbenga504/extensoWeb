import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Colors from "../assets/Colors";
import { LightText } from "./AppText";
import Icon from "./Icon";
import Fonts from "../assets/Fonts";

const Button = styled.div`
  width: inherit;
  height: 50px;
  cursor: pointer;
  padding: 0px 10px;
  background: ${Colors.section.selectCategoryButton};
`;
const Title = styled(LightText)`
  color: ${Colors.section.selectCategoryText};
`;
const DropDown = styled.div`
  background: ${Colors.section.selectCategoryDropdown};
  width: inherit;
  box-shadow: 0 1px 4px ${Colors.card.boxShadow};
  height: 100px;
  overflow-y: auto;
`;
const Item = styled.div`
  height: 50px;
  cursor: pointer;
  border-bottom: 1px solid ${Colors.section.selectCategoryItemBorder};
`;

export default class SelectCategory extends React.PureComponent {
  state = { isDropdownVisible: false };

  static defaults = {
    categories: [
      { name: "Education" },
      { name: "Informations" },
      { name: "Opportunities" },
      { name: "Current Prices" }
    ]
  };

  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    onCategorySelected: PropTypes.func.isRequired
  };

  toggleDropdown = value => {
    this.setState(
      {
        isDropdownVisible: !this.state.isDropdownVisible
      },
      () =>
        this.props.onCategorySelected && this.props.onCategorySelected(value)
    );
  };

  render() {
    let { isDropdownVisible } = this.state;
    const display = isDropdownVisible ? "block" : "none";
    return (
      <div
        className={`d-flex flex-column ${this.props.className || ""}`}
        style={{ width: 200, height: "100%" }}
      >
        <Button
          onClick={() =>
            this.setState({ isDropdownVisible: !isDropdownVisible })
          }
          className="d-flex justify-content-between align-items-center"
        >
          <Title style={Fonts.section.select}>
            {(this.props.title.trim().length > 0 && this.props.title) ||
              "Select a Category"}
          </Title>
          <Icon
            className="ion-ios-arrow-down"
            forceColor={true}
            style={{ color: Colors.section.selectCategoryText }}
          />
        </Button>
        <DropDown style={{ display }}>
          {SelectCategory.defaults.categories.map((category, i) => (
            <Item
              key={i}
              onClick={() => this.toggleDropdown(category.name)}
              className="d-flex justify-content-center align-items-center"
            >
              <LightText>{category.name}</LightText>
            </Item>
          ))}
        </DropDown>
      </div>
    );
  }
}
