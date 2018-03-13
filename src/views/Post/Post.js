import React from "react";
import { Query, Router, Mutation } from "react-composer";

import Container from "../../components/Post/Container";

export default class Post extends React.PureComponent {
  state = {
    id: undefined
  };

  gotoContentView = (id, push) => {
    this.setState({ id }, () => push());
  };

  render() {
    let { id } = this.state;
    return (
      <Query operation="getAdminPosts">
        {(queryState, fetchMore, refetchQuery) => (
          <Mutation operation="createAdminPosts">
            {(postCreationState, mutate) => (
              <Router
                name="post_router_link"
                resources={[{ operation: "getAdminPosts" }]}
                loader={() => import("../Content")}
                onRequestRouter={() =>
                  this.props.history.push(`/content/${id}`)
                }
              >
                {(routeState, fetchState, push) => (
                  <Container
                    content={queryState}
                    routeMatch={this.props.match}
                    reduxActions={this.props.route}
                    onCreatePost={mutate}
                    loading={postCreationState.loading}
                    onRequestRoute={id => this.gotoContentView(id, push)}
                  />
                )}
              </Router>
            )}
          </Mutation>
        )}
      </Query>
    );
  }
}
