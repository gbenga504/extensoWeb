import React from "react";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";
import { composer } from "../../containers/composer";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

class Home extends React.PureComponent {
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
      .catch(error => {
        this.props.route.setReportNotification({
          id: Date.now(),
          message: "Error in deleting the post"
        });
      });
  };

  fetchMore = pageNumber => {
    let { contents: { fetchMore } } = this.props;
    fetchMore({
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/${pageNumber}`
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
    this.props.route.setIsContentDraftState(false);
    search(queryParams);
  };

  render() {
    let {
        contents: { loading, isInitialDataSet, error, items },
        likes,
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
              <Counter items={likes || {}} />
              <List
                dataArray={items}
                onLoadMore={this.fetchMore}
                loading={loading}
                onEdit={id => routeTo("/post/", id)}
                onViewContent={id => routeTo("/content/", id)}
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

const HomeWithData = composer("get", {
  name: "all_news",
  options: props => ({
    variables: {
      url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/0"
    }
  }),
  props: ({
    all_news: { fetchMore, result, loading, error, isInitialDataSet }
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
  composer("get", {
    name: "likes_count",
    options: props => ({
      variables: {
        url: "https://agro-extenso.herokuapp.com/api/v1/post-count/"
      }
    }),
    props: ({ likes_count: { result } }) => ({
      likes: result
    })
  })(
    composer("push", {
      name: "content_edit_or_view",
      props: ({ push }) => ({
        routeTo: (link, id) =>
          push({
            goto: `${link}${id}`,
            variables: {
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${id}`
            }
          }),
        search: queryParams => {
          let uriQueryParams = encodeURI(queryParams);

          return push({
            goto: `/search/?q=${uriQueryParams}`,
            variables: {
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/false/0?q=${queryParams}`
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
              name: "likes_count",
              url: "https://agro-extenso.herokuapp.com/api/v1/post-count/all/"
            },
            {
              name: "all_news",
              url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/0"
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
      })(Home)
    )
  )
);

export default HomeWithData;
