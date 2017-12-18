import React from "react";
import PropTypes from "prop-types";

import Icon from "../Icon";
import Fonts from "../../assets/Fonts";
import Colors from "../../assets/Colors";
import { LightText } from "../AppText";

export default class Footer extends React.PureComponent {
  static propTypes = {
    likesCount: PropTypes.string,
    hideLikes: PropTypes.bool,
    id: PropTypes.string.isRequired
  };

  static contextTypes = {
    onEdit: PropTypes.func.isRequired
  };

  render() {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginTop: 10 }}
      >
        {this.props.hideLikes ? (
          <span />
        ) : (
          <div className="d-flex">
            <Icon className="ion-heart" size="30" />
            <LightText style={{ ...Fonts.likesCount.sm, marginLeft: 5 }}>
              {this.props.likesCount}
            </LightText>
          </div>
        )}
        <div className="d-flex">
          <Icon
            onClick={() => this.context.onEdit(this.props.id)}
            className="ion-edit"
            size="30"
            style={{ cursor: "pointer" }}
          />
          <Icon
            forceColor
            onClick={() => this.context.onDelete(this.props.id)}
            className="ion-ios-trash"
            size="30"
            style={{
              color: Colors.card.delete,
              marginLeft: 20,
              cursor: "pointer"
            }}
          />
        </div>
      </div>
    );
  }
}
