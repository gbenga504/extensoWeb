import React from "react";
import { Mutation, Query } from "react-composer";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";

export default class Home extends React.PureComponent {
  state = {
    isDeleteWarningVisible: false,
    warningId: "0"
  };

  generateHeaderIcon = () => [
    {
      name: "ion-power",
      lastIcon: true,
      segmentName: "logout",
      onClick: this.logout
    }
  ];

  logout = () => {
    localStorage.removeItem("jwt");
    let { history: { push } } = this.props;
    push("/login");
  };

  render() {
    let {
        route: {
          setReportNotification,
          setIsContentDraftState,
          setIndefiniteProgressLoadingState
        },
        history
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state;

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader
          onNavigate={history}
          onSetDraftState={setIsContentDraftState}
          isContentDraftBased={false}
          iconArray={this.generateHeaderIcon()}
        />
        <Query operation="getAdminPosts">
          {(queryState, fetchMore, refetchQuery) => {
            let { isInitialDataSet, loading, error, data } = queryState;
            return (
              <PageContentViewer
                loading={!isInitialDataSet && loading}
                error={!isInitialDataSet && error !== undefined}
                renderItem={
                  <ContentPadder className="flex-column">
                    <Query
                      operation="getPostCount"
                      config={{ fetchPolicy: "cache-and-network" }}
                    >
                      {postCount => <Counter items={postCount.data || {}} />}
                    </Query>
                    <List
                      dataArray={data}
                      onLoadMore={fetchMore}
                      loading={loading}
                      reduxActions={this.props.route}
                      onNavigate={history}
                      onDelete={id =>
                        this.setState({
                          isDeleteWarningVisible: true,
                          warningId: id
                        })
                      }
                    />
                  </ContentPadder>
                }
              />
            );
          }}
        </Query>
        <Mutation
          operation="createDeletePost"
          options={{
            refetchQueries: [
              { operation: "getAdminPosts" },
              { operation: "getPostCount" }
            ]
          }}
        >
          {(deleteState, mutate) => (
            <WarningModal
              isVisible={isDeleteWarningVisible}
              id={warningId}
              onRequestPostDelete={mutate}
              deletionLoading={deleteState.loading}
              onRequestGranted={setReportNotification}
              onRequestLoadingProgressBar={setIndefiniteProgressLoadingState}
              onRequestClose={() =>
                this.setState({ isDeleteWarningVisible: false })
              }
            />
          )}
        </Mutation>
      </div>
    );
  }
}
