import React from "react";
import { Mutation, Query } from "react-composer";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";
import { CircularSpinner } from "../../components/Loaders";

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
        route,
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
          reduxActions={route}
        />
        <Query
          operation="getAdminPosts"
          options={{ fetchPolicy: "network-only" }}
        >
          {(queryState, fetchMore, refetchQuery) => {
            let { isInitialDataSet, loading, error, data } = queryState;
            return (
              <PageContentViewer
                loading={!isInitialDataSet && loading}
                error={!isInitialDataSet && error}
                renderItem={
                  <ContentPadder className="flex-column">
                    <Query
                      operation="getPostCount"
                      options={{
                        fetchPolicy: "network-only",
                        config: { params: { category: "all" } }
                      }}
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
            config: { ID: warningId },
            refetchQueries: [
              { operation: "getAdminPosts" },
              {
                operation: "getPostCount",
                config: { params: { category: "all" } }
              }
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
