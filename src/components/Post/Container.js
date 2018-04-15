import React from "react";
import PropTypes from "prop-types";
import uuid from "uuid";
import { Query } from "react-kunyora";

import PageContentViewer from "../../containers/PageContentViewer";
import DashboardHeader from "../DashboardHeader";
import Form from "../Post/Form";
import ContentPadder from "../../containers/ContentPadder";
import { GeneralBasedUtils } from "../../utils";

export default class Post extends React.PureComponent {
  constructor(props) {
    super(props);
    let { content: { data } } = props;
    this.state = {
      draftStatusText: "",
      data: {
        uuid: (data && data.id) || uuid(),
        token: localStorage.getItem("jwt"),
        bodyHTML: (data && data.content) || "",
        titleHTML: (data && data.title) || "",
        category: (data && data.category) || "",
        tags: (data && data.tags) || [],
        draft: (data && data.draft) || true
      },
      hasInformationLoaded: false
    };
  }

  static propTypes = {
    content: PropTypes.shape({
      data: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string,
        category: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string),
        draft: PropTypes.bool,
        created_at: PropTypes.string,
        likes_count: PropTypes.string
      }),
      loading: PropTypes.bool.isRequired,
      error: PropTypes.any
    }),
    reduxActions: PropTypes.object.isRequired,
    onCreatePost: PropTypes.func.isRequired,
    onRequestRoute: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    routeMatch: PropTypes.object.isRequired,
    setPostId: PropTypes.func.isRequired,
    progress: PropTypes.number
  };

  componentDidMount() {
    let { data: { uuid } } = this.state;
    this.props.setPostId(uuid);
  }

  componentWillReceiveProps(nextProps) {
    let {
      reduxActions: {
        setIndefiniteProgressLoadingState,
        setPageHandshakeProgress
      },
      loading
    } = this.props;
    this.updateStateWithProps(nextProps);
    if (nextProps.loading !== loading) {
      setIndefiniteProgressLoadingState(nextProps.loading);
    }

    if (nextProps.progress !== this.props.progress) {
      setPageHandshakeProgress(nextProps.progress);
    }
  }

  updateStateWithProps = nextProps => {
    if (nextProps.content.data && !this.state.hasInformationLoaded) {
      let { content: { data } } = nextProps;
      GeneralBasedUtils.setInitialHashTags(data.tags);
      this.setState({
        data: {
          ...this.state.data,
          bodyHTML: data.content,
          titleHTML: data.title,
          category: data.category,
          tags: data.tags,
          draft: data.draft,
          uuid: data.id
        },
        hasInformationLoaded: true
      });
    }
  };

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
    let { data: { titleHTML, bodyHTML, category } } = this.state,
      { reduxActions: { setReportNotification } } = this.props;
    if (
      titleHTML.trim().length > 0 &&
      bodyHTML.trim().length > 0 &&
      category.trim().length > 0
    ) {
      this.savePost(isDraft, shouldMakePost);
    } else {
      setReportNotification({
        id: Date.now(),
        type: "error",
        message:
          "Error tried while making post, check your network settings. Check that category and title are entered"
      });
    }
  };

  makePost = shouldMakePost => {
    if (!this._count) {
      this.props
        .onCreatePost({ data: new FormData(this.form) })
        .then(result => {
          this.setState({ draftStatusText: "Saved" });
          if (shouldMakePost) {
            this.props.onRequestRoute();
          }
        })
        .catch(err => this.setState({ draftStatusText: "Failed To Saved" }));
    }
    if (shouldMakePost) this._count = true;
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
      () => this.makePost(shouldMakePost)
    );
  };

  render() {
    let { draftStatusText, data: { draft } } = this.state,
      {
        content: { loading, error },
        routeMatch: { params: { postId } },
        reduxActions,
        reduxActions: { setReportNotification }
      } = this.props;

    return (
      <div
        className="d-flex flex-column"
        style={{ width: "100%", height: "auto" }}
      >
        <DashboardHeader
          reduxActions={reduxActions}
          hideSearch
          iconArray={this.generateHeaderIcon()}
        />
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
                setReportNotification={setReportNotification}
              />
            </ContentPadder>
          }
        />
      </div>
    );
  }
}
