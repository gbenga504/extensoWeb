import React from "react";

import Input from "../Input";
import Colors from "../../assets/Colors";
import Fonts from "../../assets/Fonts";

const TitleBox = Input.extend`
  height: 50px;
  border: 1px solid ${Colors.postInputBorder};
  margin-top: 40px;
  margin-left: 50px;
`;

const Title = props => (
  <div className="d-flex">
    <TitleBox style={Fonts.post.titleBox} />
  </div>
);

export default Title;
