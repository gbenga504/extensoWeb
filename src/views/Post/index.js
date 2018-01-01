import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid";

import PageContentViewer from "../../containers/PageContentViewer";
import { composer } from "../../containers/composer";
import DashboardHeader from "../../components/DashboardHeader";
import Form from "../../components/Post/Form";
import ContentPadder from "../../containers/ContentPadder";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";
import { GeneralBasedUtils } from "../../utils";

class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    let { content: { item } } = this.props;
    this.state = {
      draftStatusText: "",
      data: {
        uuid: (item && item.id) || uuid(),
        token: localStorage.getItem("jwt"),
        bodyHTML: (item && item.content) || "",
        titleHTML: (item && item.title) || "",
        category: (item && item.category) || "",
        tags: (item && item.tags) || "",
        draft: (item && item.draft) || true
      }
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

  componentWillReceiveProps(nextProps) {
    if (Object.keys(nextProps.content.item).length > 0) {
      let { content: { item } } = nextProps;
      this.setState({
        data: {
          ...this.state.data,
          bodyHTML: item.content,
          titleHTML: item.title,
          category: item.category,
          tags: item.tags,
          draft: item.draft,
          uuid: item.id
        }
      });
    }
  }

  setDataState = (key, value) => {
    this.setState({
      data: {
        ...this.state.data,
        [`${key}`]: value
      }
    });
  };

  generateHeaderIcon = () => [
    {
      name: "ion-paper-airplane",
      lastIcon: true,
      segmentName: "post",
      onClick: () => this.verifyPostCorrectness(false, true)
    }
  ];

  verifyPostCorrectness = (isDraft, shouldMakePost) => {
    let { data: { titleHTML, bodyHTML, category } } = this.state;
    if (
      titleHTML.trim().length > 0 &&
      bodyHTML.trim().length > 0 &&
      category.trim().length > 0
    ) {
      this.savePost(isDraft, shouldMakePost);
    }
  };

  savePost = (isDraft, shouldMakePost) => {
    let { data: { bodyHTML } } = this.state;
    let { tags, body } = GeneralBasedUtils.formatPostWithHashTags(bodyHTML);
    this.setState(
      {
        data: {
          ...this.state.data,
          draft: isDraft,
          bodyHTML: body,
          tags
        },
        draftStatusText: "Saving..."
      },
      () => {
        setTimeout(() => {
          this.props
            .post(this.form)
            .then(result => {
              this.setState({ draftStatusText: "Saved" });
              if (shouldMakePost) {
                this.props.routeToContent(result.id);
              }
            })
            .catch(err =>
              this.setState({ draftStatusText: "Failed To Saved" })
            );
        }, 1000);
      }
    );
  };

  render() {
    let { draftStatusText, data: { draft } } = this.state,
      {
        content: { loading, error },
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
                data={this.state.data}
                onSaveDraft={this.verifyPostCorrectness}
                onChangeField={this.setDataState}
                initFormRef={formRef => {
                  this.form = formRef;
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
