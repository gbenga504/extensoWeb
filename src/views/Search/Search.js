import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Mutation, Query } from "react-composer";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import { RegularText } from "../../components/AppText";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";

const ResultNumberInformer = styled(RegularText)`
  margin-top: 50px;
  margin-left: 320px;
`;

class Search extends React.PureComponent {
  state = {
    isDeleteWarningVisible: false,
    warningId: "0"
  };

  componentWillReceiveProps(nextProps) {
    let { progressCount, route: { setPageHandshakeProgress } } = this.props;
    if (nextProps.progressCount !== progressCount) {
      setPageHandshakeProgress(nextProps.progressCount);
    }
  }

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

  generateSearchValue = () => {
    let { location: { search, hash } } = this.props,
      decodedURI =
        hash.length > 0
          ? window.decodeURI(hash)
          : window.decodeURI(search.substring(3));
    return decodedURI;
  };

  render() {
    let {
        isSearchDraftBased,
        route: {
          setIsContentDraftState,
          setReportNotification,
          setIndefiniteProgressLoadingState
        }
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state,
      category = isSearchDraftBased ? "Draft Category" : "All Categories";

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        <DashboardHeader
          searchValue={this.generateSearchValue()}
          iconArray={this.generateHeaderIcon()}
          onSetDraftState={setIsContentDraftState}
          isContentDraftBased={isSearchDraftBased}
          reduxActions={this.props.route}
          onNavigate={this.props.history}
        />
        <Query
          operation="getAdminPosts"
          options={{
            config: {
              params: {
                q: this.generateSearchValue(),
                draft: isSearchDraftBased
              }
            }
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
                    <ResultNumberInformer>
                      {`Showing ${data &&
                        data.length} results for "${category}"`}
                    </ResultNumberInformer>
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
            refetchQueries: [
              { operation: "getAdminPosts" },
              {
                operation: "getAdminPosts",
                config: { params: { q: this.generateSearchValue() } }
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
              onRequestLoadingProgresBar={setIndefiniteProgressLoadingState}
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

function mapStateToProps(state) {
  return {
    isSearchDraftBased: state.isSearchDraftBased.isDraft
  };
}

export default connect(mapStateToProps)(Search);
