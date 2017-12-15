import React from "react";

import { composer } from "../../containers/composer";
import DashboardHeader from "../../components/DashboardHeader";
import Form from "../../components/Post/Form";
import ContentPadder from "../../containers/ContentPadder";
import IndefiniteProgressBar from "../../components/IndefiniteProgressBar";

class Post extends React.PureComponent {
  state = {
    draftStatusText: "",
    draft: true
  };

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
          .post({
            url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/",
            formRef: this.form
          })
          .then(result => {
            let { success, message } = result;
            if (!success) {
              this.setState({ draftStatusText: "Failed To Saved" });
            } else {
              this.setState({ draftStatusText: "Saved" });
              if (!this.state.draft && message && message.status) {
                this.props.gotoContentPage("/content", {
                  url: `https://agro-extenso.herokuapp.com/api/v1/admin/post/${message
                    .data.id}`
                });
              }
            }
          })
          .catch(err => this.setState({ draftStatusText: "Failed To Saved" }));
      }, 1000);
    });
  };

  render() {
    let { draftStatusText, draft } = this.state,
      { loading } = this.props;
    return (
      <div
        className="d-flex flex-column"
        style={{ width: "100%", height: "auto" }}
      >
        {!draft && loading && <IndefiniteProgressBar />}
        <DashboardHeader hideSearch iconArray={this.generateHeaderIcon()} />
        <ContentPadder className="flex-column">
          <Form
            draftStatusText={draftStatusText}
            draft={draft}
            onSaveDraft={this.savePost}
            initFormRef={(formRef, uuid) => {
              this.form = formRef;
              this.postId = uuid;
            }}
          />
        </ContentPadder>
      </div>
    );
  }
}

const PostWithMutation = composer("post", {
  name: "post_news",
  options: props => ({
    variables: {
      url: "https://agro-extenso.herokuapp.com/api/v1/admin/posts/"
    }
  }),
  props: ({ mutate, post_news: { loading } }) => ({
    post: mutate,
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
      gotoContentPage: push
    })
  })(Post)
);

export default PostWithMutation;
