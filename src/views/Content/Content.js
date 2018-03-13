import React from "react";
import { Query, Mutation } from "react-composer";

import { WarningModal } from "../../components/PopOver";
import PageContentViewer from "../../containers/PageContentViewer";
import DashboardHeader from "../../components/DashboardHeader";
import ContentContainer from "../../components/Content/ContentContainer";

export default class Content extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDeleteWarningVisible: false,
      warningId: props.match.params.postId,
      deletionLoading: false
    };
  }

  generateHeaderIcon = () => [
    {
      name: "ion-edit",
      lastIcon: false,
      segmentName: "edit",
      onClick: () => {
        return this.state.deletionStatus.loading
          ? () => null
          : this.props.routeTo("/post/", this.props.match.params.postId);
      },
      cursorAllowed: this.state.deletionStatus.loading ? false : true
    },
    {
      name: "ion-ios-trash",
      lastIcon: true,
      segmentName: "trash",
      onClick: () => this.setState({ isDeleteWarningVisible: true }),
      cursorAllowed: this.state.deletionStatus.loading ? false : true
    }
  ];

  render() {
    let {
        history,
        route: { setReportNotification, setIndefiniteProgressLoadingState },
        route
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state;

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader hideSearch iconArray={this.generateHeaderIcon()} />
        <Query operation="getAdminPosts">
          {(queryState, fetchMore, refetchQuery) => {
            let { loading, error } = queryState;
            return (
              <PageContentViewer
                loading={loading}
                error={!!error}
                renderItem={
                  <ContentContainer
                    item={queryState}
                    reduxActions={route}
                    onNavigate={history}
                  />
                }
              />
            );
          }}
        </Query>
        <Mutation
          operation="createDeletePost"
          options={{
            refetchQueries: [{ operation: "getAdminPostsF" }]
          }}
        >
          {(deleteState, mutate) => {
            if (deleteState.loading) this.setState({ deletionLoading: true });
            else this.setState({ deletionLoading: false });
            return (
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
            );
          }}
        </Mutation>
      </div>
    );
  }
}
