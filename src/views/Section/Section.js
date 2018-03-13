import React from "react";
import { Mutation, Query, Router } from "react-composer";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import PageContentViewer from "../../containers/PageContentViewer";
import ContentPadder from "../../containers/ContentPadder";
import Category from "../../components/Section/Category";

export default class Section extends React.PureComponent {
  state = {
    isDeleteWarningVisible: false,
    warningId: "0",
    category: "",
    pageURI: window.location.pathname
  };

  componentWillReceiveProps() {
    if (this.state.pageURI !== window.location.pathname) {
      this.setState({ pageURI: window.location.pathname, hasNextPage: true });
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

  fetchPage = (category, push) => {
    this.setState(prevState => {
      if (prevState.category !== category) {
        push();
      }
      return { category };
    });
  };

  render() {
    let {
        route: {
          setReportNotification,
          setIsContentDraftState,
          setIndefiniteProgressLoadingState,
          setPageHandshakeProgress
        },
        history
      } = this.props,
      { isDeleteWarningVisible, warningId, category } = this.state;

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
                    <Router
                      name="section_router_link"
                      loader={() => import("./Section")}
                      onRequestRoute={() =>
                        history.push(`/section/${category}`)
                      }
                      resources={[
                        {
                          operation: "getAdminPosts",
                          fetchPolicy: "network-only"
                        },
                        {
                          operation: "getPostCounts",
                          fetchPolicy: "network-only"
                        }
                      ]}
                    >
                      {(routeState, fetchProgress, push) => {
                        if (fetchProgress > 0)
                          setPageHandshakeProgress(fetchProgress);
                          
                        return (
                          <Category
                            category={this.state.category}
                            onCategorySelected={category =>
                              this.fetchPage(category, push)
                            }
                          />
                        );
                      }}
                    </Router>
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
