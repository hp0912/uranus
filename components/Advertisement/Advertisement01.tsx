import { Carousel } from "antd";
import React, { FC } from "react";
import "./advertisement.css";

const provide = require("../../assets/images/provide.gif");
const wechatpay = require("../../assets/images/wechatpay.png");
const alipay = require("../../assets/images/alipay.png");

export const Advertisement01: FC = (props) => {
  return (
    <div className="uranus-advertisement-card">
      <div>
        <img src={provide} alt="落魄前端，在线炒粉" className="advertisement01" />
      </div>
      <Carousel autoplay>
        <div>
          <img src={wechatpay} alt="微信支付" className="advertisement01-wechatpay" />
        </div>
        <div>
          <img src={alipay} alt="支付宝支付" className="advertisement01-alipay" />
        </div>
      </Carousel>
    </div>
  );
};