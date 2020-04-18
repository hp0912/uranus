import { Carousel } from "antd";
import React, { FC } from "react";
import "./advertisement.css";

export const Advertisement01: FC = (props) => {
  return (
    <div className="uranus-advertisement-card">
      <div className="advertisement01-bg" />
      <Carousel autoplay>
        <div className="advertisement01-wechatpay" />
        <div className="advertisement01-alipay" />
      </Carousel>
    </div>
  );
};