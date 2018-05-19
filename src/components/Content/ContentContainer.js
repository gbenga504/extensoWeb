import React from "react";
import PropTypes from "prop-types";
import { Router, Query } from "react-kunyora";
import styled from "styled-components";

import ContentPadder from "../../containers/ContentPadder";
import { ContentTop, ContentBody } from "../Content";
import MoreContainer from "../../components/Content/MoreContainer";

const Container = styled.div`
  padding: 20px 320px;
`;

export default class ContentContainer extends React.PureComponent {
  state = {
    searchParam: ""
  };

  static propTypes = {
    item: PropTypes.object.isRequired,
    reduxActions: PropTypes.object.isRequired,
    onNavigate: PropTypes.object.isRequired
  };

  setSearchParam = (searchParam, callback) => {
    this.setState({ searchParam }, () => callback());
  };

  render() {
    let {
        item: { loading, error, data },
        reduxActions,
        onNavigate
      } = this.props,
      newItem = data || {},
      { category, created_at, content, title, draft } = newItem,
      { searchParam } = this.state;

    return (
      <ContentPadder>
        <div className="d-flex" style={{ width: "100%", background: "#fff" }}>
          <Container className="d-flex flex-column" style={{ width: "100%" }}>
            <ContentTop
              category={category}
              createdAt={created_at}
              content={content}
              title={title}
            />
            <Router
              name="search_router_link"
              loader={() => import("../../views/Search")}
              onRequestRoute={() =>
                onNavigate.push(`/search/?q=${searchParam}`)
              }
              resources={[
                {
                  operation: "getAdminPosts",
                  fetchPolicy: "network-only",
                  config: { params: { q: searchParam, draft } }
                }
              ]}
            >
              {(routeState, fetchProgress, push) => (
                <ContentBody
                  content={content}
                  reduxActions={reduxActions}
                  routeProgress={fetchProgress}
                  onRequestRoute={push}
                  draft={draft}
                  onRequestSearchByTag={this.setSearchParam}
                />
              )}
            </Router>
            <Query operation="getAdminPosts">
              {queryState => (
                <MoreContainer
                  data={queryState.data}
                  onNavigate={onNavigate}
                  reduxActions={reduxActions}
                />
              )}
            </Query>
          </Container>
        </div>
      </ContentPadder>
    );
  }
}
