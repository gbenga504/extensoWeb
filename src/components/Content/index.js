import React from "react";
import PropTypes from "prop-types";

import UserContentInformation from "../UserContentInformation";
import { RegularText, LightText } from "../AppText";
import Fonts from "../../assets/Fonts";

export const ContentTop = props => [
  <UserContentInformation
    key={0}
    category={props.category}
    createdAt={props.createdAt}
    content={props.content}
  />,
  <RegularText key={1} style={{ ...Fonts.content.title, marginTop: 20 }}>
    {props.title}
  </RegularText>
];

ContentTop.propTypes = {
  category: PropTypes.string.isRequired,
  createdAt: PropTypes.any,
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export class ContentBody extends React.PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    reduxActions: PropTypes.object.isRequired,
    routeProgress: PropTypes.number,
    onRequestRoute: PropTypes.func.isRequired,
    onRequestSearchByTag: PropTypes.func.isRequired,
    draft: PropTypes.bool.isRequired
  };

  componentWillReceiveProps(nextProps) {
    let {
      routeProgress,
      reduxActions: { setPageHandshakeProgress }
    } = this.props;
    if (nextProps.routeProgress !== routeProgress) {
      setPageHandshakeProgress(nextProps.routeProgress);
    }
  }

  createContentInnerHTML = content => ({
    __html: content
  });

  handleTagSearch = ev => {
    let { target } = ev,
      {
        draft,
        onRequestSearchByTag,
        onRequestRoute,
        reduxActions: { setIsContentDraftState }
      } = this.props;
    if (
      target.nodeName.toUpperCase() === "A" &&
      target.hasAttribute("hashTag")
    ) {
      ev.preventDefault();
      //@remove hack
      draft = draft == false ? false : true;
      setIsContentDraftState(draft);
      onRequestSearchByTag(target.getAttribute("hashTag"), onRequestRoute);
    } else {
      ev.preventDefault();
      window.open(target.href);
    }
  };

  render() {
    let { content } = this.props;
    return [
      <LightText
        key={0}
        onClick={this.handleTagSearch}
        dangerouslySetInnerHTML={this.createContentInnerHTML(content)}
        style={{ ...Fonts.content.body, marginTop: 20 }}
      />,
      <UserContentInformation key={1} hideDetails style={{ marginTop: 50 }} />
    ];
  }
}
