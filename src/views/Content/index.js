import React from "react";
import PropTypes from "prop-types";
import { Connector, Router } from "react-kunyora";

let Content = null;

export default (Content = props => (
  <Connector
    name="content_router_link"
    loader={() => import("./Content")}
    loadingComponent={null}
    errorComponent={null}
    delay={2000}
    timeout={10000}
  >
    {(Component, passedProps) => {
      let _props = { ...props, ...passedProps },
        {
          match: { params: { postId } },
          history: { push, location: { search } }
        } = props,
        _search = search.match(/=[a-z]+/)[0].slice(1),
        _draft = _search == "false" ? false : true;
      return (
        <Router
          name="post_router_link"
          loader={() => import("../Post")}
          onRequestRoute={() => push(`/post/${postId}?draft=${_draft}`)}
          resources={[
            {
              operation: "getAdminPosts",
              config: { ID: postId, params: { draft: _draft } },
              fetchPolicy: "network-only"
            }
          ]}
        >
          {(routeState, fetchProgress, push) => {
            let _newProps = {
              ..._props,
              fetchProgress,
              onRequestEditPost: push
            };
            return <Component {..._newProps} />;
          }}
        </Router>
      );
    }}
  </Connector>
));
