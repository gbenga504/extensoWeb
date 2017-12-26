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
    let { contents: { fetchMore }, isSearchDraftBased } = this.props;
    fetchMore({
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${isSearchDraftBased}/${pageNumber}`
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult.length === 0) {
          this.setState({ hasNextPage: false });
        }
        return [...previousResult, ...fetchMoreResult];
      }
    });
  };

  fetchPage = () => {
    let { refetchContent, isSearchDraftBased } = this.props;
    refetchContent(isSearchDraftBased);
  };

  generateSearchValue = () => {
    let queryParams = this.props.match.params.queryParams,
      decodedURI = window.decodeURI(queryParams);
    return decodedURI;
  };

  render() {
    let {
        contents: { loading, isInitialDataSet, error, items },
        routeTo,
        deletionStatus,
        isSearchDraftBased,
        refetchContent
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state,
      category = isSearchDraftBased ? "Draft Category" : "All Categories";

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {deletionStatus.loading && <IndefiniteProgressBar />}
        <DashboardHeader
          searchValue={this.generateSearchValue()}
          iconArray={this.generateHeaderIcon()}
          onSearch={value => refetchContent(value, isSearchDraftBased)}
        />
        <PageContentViewer
          loading={!isInitialDataSet && loading}
          error={!isInitialDataSet && error !== undefined}
          renderItem={
            <ContentPadder className="flex-column">
              <ResultNumberInformer>
                {`Showing ${items && items.length} results for "${category}"`}
              </ResultNumberInformer>
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

function mapStateToProps(state) {
  return {
    isSearchDraftBased: state.isSearchDraftBased.isDraft
  };
}

const SearchWithData = composer("connect", {
  name: "search_content",
  options: props => {
    let queryParams = props.match.params.queryParams,
      decodedURI = window.decodeURI(queryParams);
    return {
      variables: {
        url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${
          props.isSearchDraftBased
        }/0?q=${decodedURI}`
      }
    };
  },
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
      refetchContent: (queryParams, isSearchDraftBased) => {
        let uriQueryParams = encodeURI(queryParams);
        return push({
          goto: `/search/${uriQueryParams}`,
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${isSearchDraftBased}/0?q=${queryParams}`
          }
        });
      }
    })
  })(
    composer("Post", {
      name: "delete_post",
      options: props => {
        let queryParams = props.match.params.queryParams,
          decodedURI = window.decodeURI(queryParams);
        return {
          refetchQueries: [
            {
              name: "search_content",
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/search/${
                props.isSearchDraftBased
              }/0?q=${decodedURI}`
            }
          ]
        };
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
    })(Search)
  )
);

export default connect(mapStateToProps)(SearchWithData);
