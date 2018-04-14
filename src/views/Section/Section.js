import React from "react";
import { Mutation, Query, Router } from "react-kunyora";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import PageContentViewer from "../../containers/PageContentViewer";
import ContentPadder from "../../containers/ContentPadder";
import Category from "../../components/Section/Category";

export default class Section extends React.PureComponent {
  constructor(props) {
    super(props);
    let { match: { params: { category } } } = props;
    this.state = {
      isDeleteWarningVisible: false,
      warningId: "0",
      category: category || "all"
    };
  }

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

  fetchPage = (category, push) => {
    this.setState({ category }, () => push());
  };

  render() {
    let {
        route: {
          setReportNotification,
          setIsContentDraftState,
          setIndefiniteProgressLoadingState,
          setPageHandshakeProgress
        },
        history,
        route
      } = this.props,
      { isDeleteWarningVisible, warningId, category } = this.state;

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
          options={{ config: { params: { category } } }}
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
                        config: { params: { category } }
                      }}
                    >
                      {postCount => <Counter items={postCount.data || {}} />}
                    </Query>
                    <Router
                      name="section_router_link"
                      loader={() => import("./Section")}
                      onRequestRoute={() =>
                        history.push(`/sections/${category}`)
                      }
                      resources={[
                        {
                          operation: "getAdminPosts",
                          fetchPolicy: "network-only",
                          config: { params: { category: category } }
                        },
                        {
                          operation: "getPostCount",
                          fetchPolicy: "network-only",
                          config: { params: { category: category } }
                        }
                      ]}
                    >
                      {(routeState, fetchProgress, push) => (
                        <Category
                          category={this.state.category}
                          fetchProgress={fetchProgress}
                          sendFetchProgressToRedux={setPageHandshakeProgress}
                          onCategorySelected={category =>
                            this.fetchPage(category, push)
                          }
                        />
                      )}
                    </Router>
                    <List
                      dataArray={data}
                      generalCategory={category}
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
              { operation: "getAdminPosts", config: { params: { category } } },
              { operation: "getPostCount", config: { params: { category } } }
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
