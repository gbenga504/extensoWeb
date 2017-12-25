import React from "react";
import PropTypes from "prop-types";

import PageContentViewer from "../../containers/PageContentViewer";
import { composer } from "../../containers/composer";
import DashboardHeader from "../../components/DashboardHeader";
import Form from "../../components/Post/Form";
import ContentPadder from "../../containers/ContentPadder";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    let { content: { item } } = this.props;
    this.state = {
      draftStatusText: "",
      draft: (item && item.draft) || true
    };
  }

  static propTypes = {
    content: PropTypes.shape({
      item: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        category: PropTypes.string,
        tags: PropTypes.string,
        draft: PropTypes.bool,
        created_at: PropTypes.string,
        likes_count: PropTypes.string
      })
    })
  };

  generateHeaderIcon = () => [
    {
      name: "ion-paper-airplane",
      lastIcon: true,
      segmentName: "post",
      onClick: () => this.savePost(false, true)
    }
  ];

  savePost = (isDraft, shouldMakePost) => {
    this.setState({ draftStatusText: "Saving...", draft: isDraft }, () => {
      setTimeout(() => {
        this.props
          .post(this.form)
          .then(result => {
            this.setState({ draftStatusText: "Saved" });
            if (shouldMakePost) {
              this.props.routeToContent(result.id);
            }
          })
          .catch(err => this.setState({ draftStatusText: "Failed To Saved" }));
      }, 1000);
    });
  };

  render() {
    let { draftStatusText, draft } = this.state,
      {
        content: { loading, error, item },
        match: { params: { postId } }
      } = this.props;
    return (
      <div
        className="d-flex flex-column"
        style={{ width: "100%", height: "auto" }}
      >
        {!draft && this.props.loading && <IndefiniteProgressBar />}
        <DashboardHeader hideSearch iconArray={this.generateHeaderIcon()} />
        <PageContentViewer
          loading={loading && !!postId}
          error={!!error && !!postId}
          renderItem={
            <ContentPadder className="flex-column">
              <Form
                draftStatusText={draftStatusText}
                draft={draft}
                data={item}
                onSaveDraft={this.savePost}
                initFormRef={(formRef, uuid) => {
                  this.form = formRef;
                  this.postId = uuid;
                }}
              />
            </ContentPadder>
          }
        />
      </div>
    );
  }
}

const PostWithMutation = composer("connect", {
  name: "post_contents",
  skip: props => (props.match.params.postId ? false : true),
  options: props => ({
    variables: {
      url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${
        props.match.params.postId
      }`
    }
  }),
  props: ({ post_contents: { loading, error, result } }) => ({
    content: {
      loading,
      error,
      item: result || {}
    }
  })
})(
  composer("post", {
    name: "post_news",
    options: props => ({
      variables: {
        url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/"
      }
    }),
    props: ({ mutate, post_news: { loading } }) => ({
      post: formRef =>
        mutate({
          variables: {
            url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/",
            formRef
          }
        }),
      loading
    })
  })(
    composer("push", {
      name: "push_to_content",
      options: props => ({
        variables: {
          url: "https://agro-extenso.herokuapp.com/api/v1/admin/post/"
        }
      }),
      props: ({ push }) => ({
        routeToContent: id =>
          push({
            goto: `/content/${id}`,
            variables: {
              url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${id}`
            }
          })
      })
    })(Post)
  )
);

export default PostWithMutation;
