import React from "react";
import PropTypes from "prop-types";
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

  static propTypes = {
    fetchProgress: PropTypes.any,
    onRequestEditPost: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    let {
      progressCount,
      fetchProgress,
      route: { setPageHandshakeProgress }
    } = this.props;
    if (nextProps.progressCount !== progressCount) {
      setPageHandshakeProgress(nextProps.progressCount);
    }

    if (nextProps.fetchProgress !== fetchProgress) {
      setPageHandshakeProgress(nextProps.fetchProgress);
    }
  }

  generateHeaderIcon = () => [
    {
      name: "ion-edit",
      lastIcon: false,
      segmentName: "edit",
      onClick: () => {
        return this.state.deletionLoading
          ? () => null
          : this.props.onRequestEditPost();
      },
      cursorAllowed: this.state.deletionLoading ? false : true
    },
    {
      name: "ion-ios-trash",
      lastIcon: true,
      segmentName: "trash",
      onClick: () => this.setState({ isDeleteWarningVisible: true }),
      cursorAllowed: this.state.deletionLoading ? false : true
    }
  ];

  render() {
    let {
        history,
        match: { params: { postId } },
        route: { setReportNotification, setIndefiniteProgressLoadingState },
        route
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state;
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader
          hideSearch
          iconArray={this.generateHeaderIcon()}
          reduxActions={route}
        />
        <Query operation="getAdminPosts" options={{ config: { ID: postId } }}>
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
            config: { ID: warningId },
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
              onRunOnMount={deletionLoading =>
                this.setState({ deletionLoading })
              }
              runOnDone={() => (window.location.href = "/")}
            />
          )}
        </Mutation>
      </div>
    );
  }
}
