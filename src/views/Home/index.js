import React from "react";

import List from "../../components/List";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";
import { composer } from "../../containers/composer";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

class Home extends React.PureComponent {
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
    this.props
      .deletePost(id)
      .then(result => {
        console.log(result);
      })
      .catch(error => console.log(error));
  };

  render() {
    let {
      contents: { loading, isInitialDataSet, error, items, fetchMore },
      likes,
      routeTo,
      deletionStatus
    } = this.props;
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {deletionStatus.loading && <IndefiniteProgressBar />}
        <DashboardHeader iconArray={this.generateHeaderIcon()} />
        <PageContentViewer
          loading={!isInitialDataSet && loading}
          error={
            !isInitialDataSet &&
            (error === undefined || error.success === false)
          }
          renderItem={
            <ContentPadder className="flex-column">
              <Counter items={(likes && likes[0]) || {}} />
              <List
                dataArray={items && items.message}
                onLoadMore={fetchMore}
                loading={loading}
                onEdit={id => routeTo("/post/", id)}
                onDelete={this.deletePost}
                onViewContent={id => routeTo("/content/", id)}
              />
            </ContentPadder>
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
      fetchMore: pageNumber =>
        fetchMore({
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/${pageNumber}`
          },
          updateQuery: (previousResult, { fetchMoreResult }) => ({
            ...fetchMoreResult,
            message: [...previousResult.message, ...fetchMoreResult.message]
          })
        }),
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
        url: "https://agro-extenso.herokuapp.com/api/v1/post-count/all/"
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
          })
      })
    })(
      composer("Post", {
        name: "delete_post",
        options: {
          refetchQueries: [
            {
              name: "all_news",
              url: "https://agro-extenso.herokuapp.com/api/v1/post-count/all/"
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
