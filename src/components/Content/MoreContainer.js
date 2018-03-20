import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Router } from "react-composer";

import ContentCard from "../ContentCard";

const CardContainer = styled.div`
  margin: 100px 0px;
`;
const OtherContent = styled(ContentCard)`
  margin: 0px 20px;
`;

let MoreContainer = null;

export default (MoreContainer = props => (
  <CardContainer className="d-flex justify-content-between">
    {props.data &&
      props.data.map((item, i) => {
        if (i <= 1) {
          return (
            <Router
              key={i}
              name="content_router_link"
              loader={() => import("../../views/Content")}
              onRequestRoute={() =>
                props.onNavigate.push(`/content/${item.id}`)
              }
              resources={[
                {
                  operation: "getAdminPosts",
                  config: { ID: item.id },
                  fetchPolicy: "network-only"
                }
              ]}
            >
              {(routeState, fetchProgress, push) => (
                <OtherContent
                  key={i}
                  item={item}
                  onRequestRoute={push}
                  routeProgress={fetchProgress}
                  reduxActions={props.reduxActions}
                />
              )}
            </Router>
          );
        }
        return null;
      })}
  </CardContainer>
));

MoreContainer.propTypes = {
  data: PropTypes.any,
  onNavigate: PropTypes.func.isRequired,
  reduxActions: PropTypes.object.isRequired
};
