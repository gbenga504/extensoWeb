import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Router } from "react-kunyora";

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
      short_content: PropTypes.string.isRequired,
      category: PropTypes.string,
      tags: PropTypes.string,
      draft: PropTypes.bool,
      created_at: PropTypes.string.isRequired,
      likes_count: PropTypes.string,
      src: PropTypes.string
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onRequestRoute: PropTypes.func.isRequired,
    routeProgress: PropTypes.number,
    onNavigate: PropTypes.func.isRequired,
    reduxActions: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    let {
      routeProgress,
      reduxActions: { setPageHandshakeProgress }
    } = this.props;
    if (nextProps.routeProgress !== routeProgress) {
      setPageHandshakeProgress(nextProps.routeProgress);
    }
  }

  render() {
    let {
      item: {
        category,
        created_at,
        short_content,
        title,
        src,
        likes_count,
        id,
        draft
      },
      className,
      style,
      onDelete,
      onRequestRoute,
      onNavigate,
      reduxActions
    } = this.props;

    return (
      <Container
        onClick={onRequestRoute}
        className={`d-flex flex-column ${className}`}
        style={style}
      >
        <UserContentInformation
          category={category}
          createdAt={created_at}
          content={short_content}
        />
        <Body
          isDisplayImageSet={true}
          src={src}
          title={title}
          content={short_content}
        />
        <Router
          name="post_router_link"
          loader={() => import("../../views/Post")}
          onRequestRoute={() => onNavigate.push(`/post/${id}?draft=${draft}`)}
          resources={[
            {
              operation: "getAdminPosts",
              fetchPolicy: "network-only",
              config: { ID: id, params: { draft } }
            }
          ]}
        >
          {(routeState, fetchProgress, push) => (
            <Footer
              hideLikes
              routeProgress={fetchProgress}
              likesCount={likes_count}
              id={id}
              onDelete={onDelete}
              onRequestRoute={push}
              reduxActions={reduxActions}
            />
          )}
        </Router>
      </Container>
    );
  }
}
