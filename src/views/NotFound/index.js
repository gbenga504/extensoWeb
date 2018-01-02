import React from "react";
import styled from "styled-components";

import { BoldText } from "../../components/AppText";

const Text = styled(BoldText)`
  font-size: 30px;
`;

export default props => (
  <div
    className="d-flex flex-column justify-content-center align-items-center"
    style={{ width: "100%" }}
  >
    <img src="/images/error.png" width="500px" height="500px" />
    <Text>The page you requested is was not found</Text>
  </div>
);
