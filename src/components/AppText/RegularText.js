import React from "react";
import styled from "styled-components";

const Text = styled.span`font-family: "Circular Regular";`;

export default props => <Text {...props}>{props.children}</Text>;
