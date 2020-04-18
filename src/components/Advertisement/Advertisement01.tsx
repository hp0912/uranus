import { Carousel } from "antd";
import React, { FC } from "react";
import "./advertisement.css";

export const Advertisement01: FC = (props) => {
  return (
    <div className="uranus-advertisement-card">
      <div>
        <img src={require("../../assets/images/provide.gif")} alt="落魄前端，在线炒粉" className="advertisement01" />
      </div>
      <Carousel autoplay>
        <div>
          <img src={require("../../assets/images/wechatpay.png")} alt="微信支付" className="advertisement01-wechatpay" />
        </div>
        <div>
          <img src={require("../../assets/images/alipay.png")} alt="支付宝支付" className="advertisement01-alipay" />
        </div>
      </Carousel>
    </div>
  );
};