import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { composer } from "../../containers/composer";
import { WarningModal } from "../../components/PopOver";
import PageContentViewer from "../../containers/PageContentViewer";
import { RegularText, LightText } from "../../components/AppText";
import ContentPadder from "../../containers/ContentPadder";
import Fonts from "../../assets/Fonts";
import ContentCard from "../../components/ContentCard";
import DashboardHeader from "../../components/DashboardHeader";
import UserContentInformation from "../../components/UserContentInformation";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

const Container = styled.div`
  padding: 20px 100px;
`;
const CardContainer = styled.div`
  margin: 100px 0px;
`;
const OtherContent = styled(ContentCard)`
  margin: 0px 20px;
`;

class Content extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDeleteWarningVisible: false,
      warningId: props.match.params.postId
    };
  }

  generateHeaderIcon = () => [
    {
      name: "ion-edit",
      lastIcon: false,
      segmentName: "edit",
      onClick: () => {
        return this.props.deletionStatus.loading
          ? () => null
          : this.props.routeTo("/post/", this.props.match.params.postId);
      },
      cursorAllowed: this.props.deletionStatus.loading ? false : true
    },
    {
      name: "ion-ios-trash",
      lastIcon: true,
      segmentName: "trash",
      onClick: () => this.setState({ isDeleteWarningVisible: true }),
      cursorAllowed: this.props.deletionStatus.loading ? false : true
    }
  ];

  static propTypes = {
    content: PropTypes.shape({
      item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        tags: PropTypes.string,
        draft: PropTypes.bool,
        created_at: PropTypes.string.isRequired,
        likes_count: PropTypes.string
      })
    })
  };

  deletePost = () => {
    this.setState({ isDeleteWarningVisible: false });
    this.props
      .deletePost()
      .then(result => {
        this.props.route.setReportNotification({
          id: Date.now(),
          message: "Post was deleted successfully"
        });
        this.props.history.push("/");
      })
      .catch(error =>
        this.props.route.setReportNotification({
          id: Date.now(),
          message: "Error in deleting the post"
        })
      );
  };

  createContentInnerHTML = content => ({
    __html: content
  });

  render() {
    let {
        content: { loading, error, item },
        otherContents: { result },
        deletionStatus,
        routeTo
      } = this.props,
      { isDeleteWarningVisible, warningId } = this.state,
      newItem = item || {},
      { category, created_at, content, title } = newItem;

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {deletionStatus.loading && <IndefiniteProgressBar />}
        <DashboardHeader iconArray={this.generateHeaderIcon()} />
        <PageContentViewer
          loading={loading}
          error={!!error}
          renderItem={
            <ContentPadder>
              <div className="d-flex" style={{ width: "100%" }}>
                <Container
                  className="d-flex flex-column"
                  style={{ width: "100%" }}
                >
                  <UserContentInformation
                    category={category}
                    createdAt={created_at}
                    content={content}
                  />
                  <RegularText
                    style={{ ...Fonts.content.title, marginTop: 20 }}
                  >
                    {title}
                  </RegularText>
                  <LightText
                    dangerouslySetInnerHTML={this.createContentInnerHTML(
                      content
                    )}
                    style={{ ...Fonts.content.body, marginTop: 20 }}
                  />
                  <UserContentInformation
                    hideDetails
                    style={{ marginTop: 50 }}
                  />
                  <CardContainer className="d-flex justify-content-between">
                    {result &&
                      result.map((item, i) => {
                        if (parseInt(i) <= 1) {
                          return (
                            <OtherContent
                              key={i}
                              item={item}
                              onViewContent={id => routeTo("/content/", id)}
                            />
                          );
                        }
                        return null;
                      })}
                  </CardContainer>
                </Container>
              </div>
              <WarningModal
                isVisible={isDeleteWarningVisible}
                id={warningId}
                onRequestDelete={this.deletePost}
                onRequestClose={() =>
                  this.setState({ isDeleteWarningVisible: false })
                }
              />
            </ContentPadder>
          }
        />
      </div>
    );
  }
}

const ContentWithData = composer("connect", {
  name: "content_data",
  options: props => ({
    variables: {
      url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${
        props.match.params.postId
      }`
    }
  }),
  props: ({ content_data: { loading, error, result } }) => ({
    content: {
      loading,
      error,
      item: result
    }
  })
})(
  composer("get", {
    name: "other_contents",
    options: {
      variables: {
        url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/0"
      }
    },
    props: ({ other_contents }) => ({
      otherContents: other_contents
    })
  })(
    composer("push", {
      name: "push_based_request",
      options: props => ({
        variables: {
          url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${
            props.match.params.postId
          }`
        }
      }),
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
      composer("post", {
        name: "delete_content",
        options: props => ({
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/delete/${
              props.match.params.postId
            }`
          },
          refetchQueries: [
            {
              name: "all_news",
              url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/0"
            }
          ]
        }),
        props: ({ delete_content, mutate }) => ({
          deletionStatus: {
            loading: delete_content.loading
          },
          deletePost: mutate
        })
      })(Content)
    )
  )
);

export default ContentWithData;
