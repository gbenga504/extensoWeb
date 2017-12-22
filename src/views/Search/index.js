import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import List from "../../components/List";
import { WarningModal } from "../../components/PopOver";
import { composer } from "../../containers/composer";
import DashboardHeader from "../../components/DashboardHeader";
import { RegularText } from "../../components/AppText";
import ContentPadder from "../../containers/ContentPadder";
import PageContentViewer from "../../containers/PageContentViewer";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

const ResultNumberInformer = styled(RegularText)`
  margin-top: 50px;
  margin-left: 320px;
`;

class Search extends React.PureComponent {
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
        if (result.success === true) {
          this.props.route.setReportNotification({
            id: Date.now(),
            message: "Post was deleted successfully"
          });
        }
      })
      .catch(error =>
        this.props.route.setReportNotification({
          id: Date.now(),
          message: "Error in deleting the post"
        })
      );
  };

  fetchMore = pageNumber => {
    let { contents: { fetchMore }, isSearchDraftBased } = this.props;
    fetchMore({
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${isSearchDraftBased}/${pageNumber}`
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.message.length === 0) {
          this.setState({ hasNextPage: false });
        }
        return {
          ...fetchMoreResult,
          message: [...previousResult.message, ...fetchMoreResult.message]
        };
      }
    });
  };

  fetchPage = () => {
    let { refetchContent, isSearchDraftBased } = this.props;
    refetchContent(isSearchDraftBased);
  };

  render() {
    let {
        contents: { loading, isInitialDataSet, error, items },
        routeTo,
        deletionStatus,
        isSearchDraftBased
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state,
      category = isSearchDraftBased ? "Draft Category" : "All Categories";

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
              <ResultNumberInformer>
                {`Showing ${items &&
                  items.message &&
                  items.message.length} results for "${category}"`}
              </ResultNumberInformer>
              <List
                dataArray={items && items.message}
                onLoadMore={this.fetchMore}
                loading={loading}
                onEdit={id => routeTo("/post/", id)}
                onViewContent={id => routeTo("/content/", id)}
                onDelete={id =>
                  this.setState({
                    isDeleteWarningVisible: true,
                    warningId: id
                  })}
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
            this.setState({ isDeleteWarningVisible: false })}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSearchDraftBased: state.isSearchDraftBased.isDraft
  };
}

const SearchWithData = composer("connect", {
  name: "search_content",
  options: props => ({
    variables: {
      url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${props.isSearchDraftBased}/0`
    }
  }),
  props: ({
    search_content: { fetchMore, result, loading, error, isInitialDataSet }
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
      routeTo: (link, id, isSearchDraftBased) => {
        let url = isSearchDraftBased
          ? "https://agro-extenso.herokuapp.com/api/v1/admin/draft/"
          : "https://agro-extenso.herokuapp.com/api/v1/admin/post/";
        return push({
          goto: `${link}${id}`,
          variables: {
            url: `${url}${id}`
          }
        });
      },
      refetchContent: isSearchDraftBased => {
        push({
          goto: `/search/`,
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${isSearchDraftBased}/0`
          }
        });
      }
    })
  })(
    composer("Post", {
      name: "delete_post",
      options: props => ({
        refetchQueries: [
          {
            name: "search_content",
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${props.isSearchDraftBased}/0`
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
    })(Search)
  )
);

export default connect(mapStateToProps)(SearchWithData);
