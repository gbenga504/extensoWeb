import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Colors from "../../assets/Colors";
import UserContentInformation from "../UserContentInformation";
import Body from "./Body";
import Footer from "./Footer";

const Container = styled.div`
  padding: 10px 20px;
  background: ${Colors.card.background};
  box-shadow: 0 1px 4px ${Colors.card.boxShadow};
  border-radius: 3px;
  border: 1px solid ${Colors.card.border};
  margin: 25px 0px;
  width: 100%;
  cursor: pointer;
`;

export default class Card extends React.PureComponent {
  static PropTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    hideLikes: PropTypes.bool,
    items: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      category: PropTypes.string,
      tags: PropTypes.string,
      draft: PropTypes.bool,
      created_at: PropTypes.string.isRequired,
      likes_count: PropTypes.string
    }).isRequired,
    onViewContent: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired
  };

  render() {
    let {
      item: { category, created_at, content, title, likes_count, id },
      className,
      style,
      onViewContent,
      onEdit,
      onDelete
    } = this.props;
    return (
      <Container
        onClick={ev => onViewContent(id)}
        className={`d-flex flex-column ${className}`}
        style={style}
      >
        <UserContentInformation
          category={category}
          createdAt={created_at}
          content={content}
        />
        <Body isDisplayImageSet={true} title={title} content={content} />
        <Footer
          hideLikes
          likesCount={likes_count}
          id={id}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </Container>
    );
  }
}
