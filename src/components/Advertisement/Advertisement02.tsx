import { Affix } from "antd";
import React, { FC } from "react";
import "./advertisement.css";

export const Advertisement02: FC = (props) => {
  return (
    <Affix offsetTop={55}>
      <div className="uranus-card">
        <div>
          <img src="http://blogimages.jspang.com/flutter_ad2.jpg" alt="广告" width="100%" />
        </div>
        <div>
          <img src="http://blogimages.jspang.com/Vue_koa_ad1.jpg" alt="广告" width="100%" />
        </div>
        <div>
          <img src="http://blogimages.jspang.com/WechatIMG12.jpeg" alt="广告" width="100%" />
        </div>
        <div>
          <img src="http://newimg.jspang.com/shensanyuan.jpg" alt="广告" width="100%" />
        </div>
      </div>
    </Affix>
  );
};