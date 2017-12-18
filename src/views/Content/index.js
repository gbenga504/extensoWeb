import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { composer } from "../../containers/composer";
import PageContentViewer from "../../containers/PageContentViewer";
import { RegularText, LightText } from "../../components/AppText";
import ContentPadder from "../../containers/ContentPadder";
import Fonts from "../../assets/Fonts";
import { CircularSpinner } from "../../components/Loaders";
import ContentCard from "../../components/ContentCard";
import DashboardHeader from "../../components/DashboardHeader";
import UserContentInformation from "../../components/UserContentInformation";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

const Container = styled.div`padding: 20px 100px;`;
const CardContainer = styled.div`margin: 100px 0px;`;
const OtherContent = styled(ContentCard)`margin: 0px 20px;`;

class Content extends React.PureComponent {
  generateHeaderIcon = () => [
    {
      name: "ion-edit",
      lastIcon: false,
      segmentName: "edit",
      onClick: this.props.routeTo,
      cursorAllowed: this.props.deletionStatus.loading ? false : true
    },
    {
      name: "ion-ios-trash",
      lastIcon: true,
      segmentName: "trash",
      onClick: this.deletePost,
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
        tags: PropTypes.arrayOf(PropTypes.string.isRequired),
        draft: PropTypes.bool,
        created_at: PropTypes.string.isRequired,
        likes_count: PropTypes.string
      }).isRequired
    })
  };

  deletePost = () => {
    this.props
      .deletePost()
      .then(result => {
        let { message } = result;
        if (message && message.status === "success") {
          window.location.href = window.location.host;
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    let {
      content: {
        loading,
        error,
        item: { category, created_at, content, title }
      },
      otherContents: { result },
      deletionStatus
    } = this.props;

    return (
      <div className="d-flex flex-column" style={{ width: "100%" }}>
        {deletionStatus.loading && <IndefiniteProgressBar />}
        <DashboardHeader iconArray={this.defaults.headerIcon} />
        <PageContentViewer
          loading={loading}
          error={error}
          renderItem={
            <ContentPadder>
              <div className="d-flex">
                <Container className="d-flex flex-column">
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
                  <LightText style={{ ...Fonts.content.body, marginTop: 20 }}>
                    {content}
                  </LightText>
                  <UserContentInformation
                    hideDetails
                    style={{ marginTop: 50 }}
                  />
                  <CardContainer className="d-flex justify-content-between">
                    {result ? (
                      result.map((item, i) => (
                        <OtherContent key={i} item={item} />
                      ))
                    ) : (
                      <div className="d-flex flex-column align-items-center justify-content-center">
                        <CircularSpinner size={20} thickness={8} />
                      </div>
                    )}
                  </CardContainer>
                </Container>
              </div>
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
      url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${props.match
        .params.postId}`
    }
  }),
  props: ({ content_data: { loading, error, result } }) => ({
    content: {
      loading,
      error,
      item: result && result.data
    }
  })
})(
  composer("get", {
    name: "other_contents",
    options: {
      variables: {
        url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/all/2"
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
          url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${props
            .match.params.postId}`
        }
      }),
      props: ({ push }) => ({
        routeTo: push
      })
    })(
      composer("post", {
        name: "delete_content",
        options: props => ({
          variables: {
            url: `https://agro-extenso.herokuapp.com/api/v1/admin/delete/${props
              .match.params.postId}`
          }
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
