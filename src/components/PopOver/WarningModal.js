import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Icon from "../Icon";
import { RegularText } from "../AppText";

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background: #fff;
  z-index: 2000000;
`;
const Item = styled.div`
  height: 100%;
`;
const Close = Icon.extend`
  position: absolute;
  right: 50px;
  cursor: pointer;
`;
const Button = styled.div`
  height: 30px;
  padding: 1px 0px;
  border-radius: 2px;
  width: 100px;
  text-align: center;
  border: 1px solid #535c69;
  cursor: pointer;
`;
const DeleteButton = Button.extend`
  color: #fff;
  background: #e95656;
  border: 1px solid #e95656;
`;

export default class WarningModal extends React.PureComponent {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    id: PropTypes.string,
    onRequestClose: PropTypes.func.isRequired,
    onRequestPostDelete: PropTypes.func.isRequired,
    onRequestGranted: PropTypes.func.isRequired,
    deletionLoading: PropTypes.bool.isRequired,
    onRequestLoadingProgressBar: PropTypes.func.isRequired,
    onRunOnMount: PropTypes.func,
    runOnDone: PropTypes.func
  };

  componentWillReceiveProps(nextProps) {
    let {
      onRequestLoadingProgressBar,
      onRunOnMount,
      deletionLoading
    } = this.props;
    onRunOnMount && onRunOnMount(deletionLoading);
    if (nextProps.deletionLoading !== this.props.deletionLoading) {
      onRequestLoadingProgressBar(true);
    }
  }

  deletePost = () => {
    let {
      onRequestClose,
      onRequestGranted,
      runOnDone,
      onRequestPostDelete,
      onRequestLoadingProgressBar,
      id
    } = this.props;
    onRequestClose();
    onRequestPostDelete({ url: `admin/delete/${id}` })
      .then(result => {
        onRequestGranted({
          id: Date.now(),
          message: "Post was deleted successfully"
        });
        runOnDone && runOnDone();
        onRequestLoadingProgressBar(false);
      })
      .catch(error => {
        onRequestGranted({
          id: Date.now(),
          message: "Error in deleting the post"
        });
        onRequestLoadingProgressBar(false);
      });
  };

  render() {
    let { isVisible, onRequestClose } = this.props;
    if (isVisible) {
      return (
        <Container>
          <Close
            onClick={onRequestClose}
            forceColor
            className="ion-ios-close-empty"
            size="50px"
          />
          <Item className="d-flex align-items-center justify-content-center">
            <div className="d-flex flex-column">
              <RegularText>
                Are you sure you want to delete the post ?
              </RegularText>
              <div
                className="d-flex justify-content-between"
                style={{ marginTop: 20 }}
              >
                <DeleteButton onClick={this.deletePost}>Delete</DeleteButton>
                <Button onClick={onRequestClose}>Cancel</Button>
              </div>
            </div>
          </Item>
        </Container>
      );
    }

    return null;
  }
}
