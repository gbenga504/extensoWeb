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
    id: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  render() {
    let { onEdit, onDelete, hideLikes, likesCount, id } = this.props;
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ marginTop: 10 }}
      >
        {hideLikes ? (
          <span />
        ) : (
          <div className="d-flex">
            <Icon className="ion-heart" size="30" />
            <LightText style={{ ...Fonts.likesCount.sm, marginLeft: 5 }}>
              {likesCount}
            </LightText>
          </div>
        )}
        <div className="d-flex">
          <Icon
            onClick={() => onEdit(id)}
            className="ion-edit"
            size="35"
            style={{ cursor: "pointer" }}
          />
          <Icon
            forceColor
            onClick={() => onDelete(id)}
            className="ion-ios-trash"
            size="35"
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
