import React from "react";
import { Query, Router, Mutation } from "react-kunyora";

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
      {
        match: { params: { postId } },
        history: { location: { search } }
      } = this.props,
      _search = search && search.match(/=[a-z]+/)[0].slice(1),
      _draft = _search == "false" ? false : true;
    return (
      <Query
        operation="getAdminPosts"
        options={{ config: { ID: postId, params: { draft: _draft } } }}
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
                    config: { ID: id, params: { draft: false } },
                    fetchPolicy: "network-only"
                  }
                ]}
                loader={() => import("../Content")}
                onRequestRoute={() =>
                  this.props.history.push(`/content/${id}?draft=${false}`)
                }
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
