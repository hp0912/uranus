import React, { FC } from "react";
import styled from "styled-components";

const skin = require("../../assets/images/skin801.jpg");

export const SkinContainer = styled.div`
  background-color: rgb(64, 64, 64);
  background-image: ${"url(" + skin + ")"};
  position: fixed;
  _position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  min-width: 1000px;
  z-index: -10;
  background-position: center 0;
  background-repeat: no-repeat;
  background-size: cover;
  -webkit-background-size: cover;
  -o-background-size: cover;
  zoom: 1;
`;

export const UranusSkin: FC = () => {
  return <SkinContainer />;
};