import { Carousel } from "antd";
import React, { FC } from "react";

// 样式
import styles from "./advertisement.module.css";

export const Advertisement01: FC = (props) => {
  return (
    <div className={styles.uranus_advertisement_card}>
      <div>
        <img src="/images/provide.gif" alt="落魄前端，在线炒粉" className={styles.advertisement01} />
      </div>
      <Carousel autoplay>
        <div>
          <img src="/images/wechatpay.png" alt="微信支付" className={styles.advertisement01_wechatpay} />
        </div>
        <div>
          <img src="/images/alipay.png" alt="支付宝支付" className={styles.advertisement01_alipay} />
        </div>
      </Carousel>
    </div>
  );
};