import React from "react";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import { composer } from "../../containers/composer";
import DashboardHeader from "../../components/DashboardHeader";
import Counter from "../../components/Counter";
import PageContentViewer from "../../containers/PageContentViewer";
import SelectCategory from "../../components/SelectCategory";
import ContentPadder from "../../containers/ContentPadder";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

class Section extends React.PureComponent {
  state = {
    hasNextPage: true,
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
    let {
      contents: { fetchMore },
      match: { params: { category } }
    } = this.props;
    fetchMore({
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/admin/posts/${category}/${pageNumber}`
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.length === 0) {
          this.setState({ hasNextPage: false });
        }
        return [...previousResult, ...fetchMoreResult];
      }
    });
  };

  fetchPage = category => {
    this.setState(prevState => {
      let { refetchContent } = this.props;
      if (prevState.category !== category) {
        refetchContent(category);
      }
      return { category };
    });
  };

  render() {
    let {
        contents: { loading, isInitialDataSet, error, items },
        likes,
        routeToContent,
        deletionStatus
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state;
    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {deletionStatus.loading && <IndefiniteProgressBar />}
        <DashboardHeader iconArray={this.generateHeaderIcon()} />
        <PageContentViewer
          loading={!isInitialDataSet && loading}
          error={!isInitialDataSet && error !== undefined}
          renderItem={
            <ContentPadder className="flex-column">
              <Counter items={likes || {}} />
              <div className="d-flex" style={{ margin: "10px 320px" }}>
                <SelectCategory
                  title={this.state.category}
                  onCategorySelected={this.fetchPage}
                />
              </div>
              <div className="d-flex" style={{ marginTop: 50 }}>
                <List
                  dataArray={items}
                  onLoadMore={this.fetchMore}
                  loading={loading}
                  onEdit={id => routeToContent("/post/", id)}
                  onViewContent={id => routeToContent("/content/", id)}
                  onDelete={id =>
                    this.setState({
                      isDeleteWarningVisible: true,
                      warningId: id
                    })
                  }
                  hasNextPage={this.state.hasNextPage}
                />
              </div>
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

const SectionWithData = composer("connect", {
  name: "section_news",
  options: props => ({
    variables: {
      url: `https://agro-extenso.herokuapp.com/api/v1/admin/posts/${
        props.match.params.category
      }/0`
    }
  }),
  props: ({
    section_news: { fetchMore, result, loading, error, isInitialDataSet }
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
    name: "section_likes_count",
    options: props => ({
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/post-count/${
          props.match.params.category
        }/`
      }
    }),
    props: ({ section_likes_count: { result } }) => ({
      likes: result
    })
  })(
    composer("push", {
      name: "content_edit_or_view",
      props: ({ push }) => ({
        routeToContent: (link, id) =>
          push({
            goto: `${link}${id}`,
            variables: {
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${id}`
            }
          }),
        refetchContent: category =>
          push({
            goto: `/sections/${category}`,
            variables: {
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/posts/${category}/0`
            }
          })
      })
    })(
      composer("Post", {
        name: "delete_post",
        options: props => ({
          refetchQueries: [
            {
              name: "section_likes_count",
              url: `https://agro-extenso.herokuapp.com/api/v1/post-count/${
                props.match.params.category
              }/`
            },
            {
              name: "section_news",
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/posts/${
                props.match.params.category
              }/0`
            }
          ]
        }),
        props: ({ delete_post: { loading }, mutate }) => ({
          deletionStatus: { loading },
          deletePost: id =>
            mutate({
              variables: {
                url: `https://agro-extenso.herokuapp.com/api/v1/admin/delete/${id}`
              }
            })
        })
      })(Section)
    )
  )
);

export default SectionWithData;
