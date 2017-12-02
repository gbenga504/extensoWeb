import React from "react";
import styled from "styled-components";
import Editor from "react-medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/default.css";

import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";
import "./extenso-editor.css";
import Icon from "../Icon";

const ImageSelector = styled.div`
  position: absolute;
  margin-left: 0px;
  width: 40px;
  height: 40px;
`;
const IconSelectButton = Icon.extend`
  position: absolute;
  top: -10px;
  left: 0px;
  z-index: 400;
  cursor: pointer;
`;
const Input = styled.input`
  width: inherit;
  z-index: 1000;
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: inherit;
`;
const ExtensoEditor = styled(Editor)`
  height: auto;
  width: 100%;
  padding-top: 5px;
  border: 1px solid ${Colors.postInputBorder};
  padding-left: 12px;
  margin-bottom: 30px;
  outline: none;
  margin-left: 50px;
  background: ${Colors.postBackground};
`;

const Body = props => (
  <div className="d-flex" style={{ marginTop: 40 }}>
    <ImageSelector>
      <Input type="file" />
      <IconSelectButton className="ion-ios-plus-outline" size="40px" />
    </ImageSelector>
    <ExtensoEditor
      tag="p"
      options={{
        toolbar: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "anchor",
            "h2",
            "h3",
            "quote"
          ]
        }
      }}
      style={{ ...Fonts.post.postBox, minHeight: 335 }}
      className="postBox"
      data-placeholder="Write your post"
      onChange={() => null}
      text=""
    />
  </div>
);

export default Body;
