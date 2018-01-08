import React from "react";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import { composer } from "../../containers/composer";
import DashboardHeader from "../../components/DashboardHeader";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

class Drafts extends React.PureComponent {
  state = {
    hasNextPage: true,
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

  deletePost = id => {
    this.setState({ isDeleteWarningVisible: false });
    this.props
      .deletePost(id)
      .then(result => {
        this.props.route.setReportNotification({
          id: Date.now(),
          message: "Post was deleted successfully"
        });
      })
      .catch(error =>
        this.props.route.setReportNotification({
          id: Date.now(),
          message: "Error in deleting the post"
        })
      );
  };

  fetchMore = pageNumber => {
    let { contents: { fetchMore } } = this.props;
    fetchMore({
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/admin/drafts/${pageNumber}`
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.length === 0) {
          this.setState({ hasNextPage: false });
        }
        return [...previousResult, ...fetchMoreResult];
      }
    });
  };

  search = queryParams => {
    let { search } = this.props;
    this.props.route.setIsContentDraftState(true);
    search(queryParams);
  };

  render() {
    let {
        contents: { loading, isInitialDataSet, error, items },
        routeTo,
        deletionStatus
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state;

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {deletionStatus.loading && <IndefiniteProgressBar />}
        <DashboardHeader
          iconArray={this.generateHeaderIcon()}
          onSearch={this.search}
        />
        <PageContentViewer
          loading={!isInitialDataSet && loading}
          error={!isInitialDataSet && error !== undefined}
          renderItem={
            <ContentPadder className="flex-column">
              <List
                dataArray={items}
                onLoadMore={this.fetchMore}
                loading={loading}
                onEdit={id => routeTo("/post/", id)}
                onViewContent={id => routeTo("/post/", id)}
                onDelete={id =>
                  this.setState({
                    isDeleteWarningVisible: true,
                    warningId: id
                  })
                }
                hasNextPage={this.state.hasNextPage}
              />
            </ContentPadder>
          }
        />
        <WarningModal
          isVisible={isDeleteWarningVisible}
          id={warningId}
          onRequestDelete={this.deletePost}
          onRequestClose={() =>
            this.setState({ isDeleteWarningVisible: false })
          }
        />
      </div>
    );
  }
}

const DraftWithData = composer("get", {
  name: "drafts",
  options: props => ({
    fetchPolicy: "cache-and-network",
    variables: {
      url: "https://agro-extenso.herokuapp.com/api/v1/admin/drafts/0"
    }
  }),
  props: ({
    drafts: { fetchMore, result, loading, error, isInitialDataSet }
  }) => ({
    contents: {
      fetchMore,
      items: result,
      loading,
      error,
      isInitialDataSet
    }
  })
})(
  composer("push", {
    name: "content_edit_or_view",
    props: ({ push }) => ({
      routeTo: (link, id) => {
        return push({
          goto: `${link}${id}`,
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/draft/${id}`
          }
        });
      },
      search: queryParams => {
        let uriQueryParams = encodeURI(queryParams);

        return push({
          goto: `/search/?q=${uriQueryParams}`,
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/true/0?q=${queryParams}`
          }
        });
      }
    })
  })(
    composer("Post", {
      name: "delete_post",
      options: {
        refetchQueries: [
          {
            name: "drafts",
            url: "https://agro-extenso.herokuapp.com/api/v1/admin/drafts/0"
          }
        ]
      },
      props: ({ delete_post: { loading }, mutate }) => ({
        deletionStatus: { loading },
        deletePost: id =>
          mutate({
            variables: {
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/delete/${id}`
            }
          })
      })
    })(Drafts)
  )
);

export default DraftWithData;
