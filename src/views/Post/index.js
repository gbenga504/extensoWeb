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

  componentWillReceiveProps(nextProps) {
    let { content: { item } } = nextProps;
    this.setState({ draft: item && item.draft });
  }

  generateHeaderIcon = () => [
    {
      name: "ion-paper-airplane",
      lastIcon: true,
      segmentName: "post",
      onClick: () => (!this.state.draft ? null : this.savePost(false)),
      cursorAllowed: !this.state.draft ? false : true
    }
  ];

  savePost = isDraft => {
    this.setState({ draftStatusText: "Saving...", draft: isDraft }, () => {
      setTimeout(() => {
        this.props
          .post(this.form)
          .then(result => {
            let { success, message } = result;
            if (!success) {
              this.setState({ draftStatusText: "Failed To Saved" });
            } else {
              this.setState({ draftStatusText: "Saved" });
              if (!this.state.draft && message && message.status) {
                this.props.routeToContent(message.data.id);
              }
            }
          })
          .catch(err => this.setState({ draftStatusText: "Failed To Saved" }));
      }, 1000);
    });
  };

  render() {
    let { draftStatusText, draft } = this.state,
      { content: { loading, error, item } } = this.props;
    return (
      <div
        className="d-flex flex-column"
        style={{ width: "100%", height: "auto" }}
      >
        {!draft && this.props.loading && <IndefiniteProgressBar />}
        <DashboardHeader hideSearch iconArray={this.generateHeaderIcon()} />
        <PageContentViewer
          loading={loading}
          error={error}
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
  options: props => ({
    variables: {
      url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${props.match
        .params.postId}`
    }
  }),
  props: ({ post_contents: { loading, error, result } }) => ({
    content: {
      loading,
      error,
      item: result && result.data
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
