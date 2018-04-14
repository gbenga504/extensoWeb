import React from "react";
import { Query, Mutation } from "react-kunyora";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";

export default class Drafts extends React.PureComponent {
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
          setIsContentDraftState,
          setReportNotification,
          setIndefiniteProgressLoadingState
        },
        route
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state;

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader
          onNavigate={this.props.history}
          onSetDraftState={setIsContentDraftState}
          isContentDraftBased={true}
          iconArray={this.generateHeaderIcon()}
          reduxActions={route}
        />
        <Query
          operation="getAdminPosts"
          options={{
            fetchPolicy: "network-only",
            config: { params: { draft: true } }
          }}
        >
          {(queryState, fetchMore, refetchQuery) => {
            let { isInitialDataSet, loading, error, data } = queryState;
            return (
              <PageContentViewer
                loading={!isInitialDataSet && loading}
                error={!isInitialDataSet && error}
                renderItem={
                  <ContentPadder className="flex-column">
                    <List
                      dataArray={data}
                      onLoadMore={fetchMore}
                      loading={loading}
                      reduxActions={this.props.route}
                      onNavigate={this.props.history}
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
            refetchQueries: [{ operation: "getAdminPosts" }]
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
