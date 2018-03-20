import React from "react";
import { Query, Router, Mutation } from "react-composer";

import Container from "../../components/Post/Container";

export default class Post extends React.PureComponent {
  state = {
    id: undefined
  };

  componentWillReceiveProps(nextProps) {
    let { progressCount, route: { setPageHandshakeProgress } } = this.props;
    if (nextProps.progressCount !== progressCount) {
      setPageHandshakeProgress(nextProps.progressCount);
    }
  }

  render() {
    let { id } = this.state,
      { match: { params: { postId } } } = this.props;
    return (
      <Query
        operation="getAdminPosts"
        options={{ config: { ID: postId } }}
        skip={postId ? false : true}
      >
        {(queryState, fetchMore, refetchQuery) => (
          <Mutation operation="createAdminPosts">
            {(postCreationState, mutate) => (
              <Router
                name="content_router_link"
                resources={[
                  {
                    operation: "getAdminPosts",
                    config: { ID: id },
                    fetchPolicy: "network-only"
                  }
                ]}
                loader={() => import("../Content")}
                onRequestRoute={() => this.props.history.push(`/content/${id}`)}
              >
                {(routeState, fetchProgress, push) => {
                  return (
                    <Container
                      content={queryState}
                      routeMatch={this.props.match}
                      reduxActions={this.props.route}
                      onCreatePost={mutate}
                      progress={fetchProgress}
                      loading={postCreationState.loading}
                      setPostId={id => this.setState({ id })}
                      onRequestRoute={push}
                    />
                  );
                }}
              </Router>
            )}
          </Mutation>
        )}
      </Query>
    );
  }
}
