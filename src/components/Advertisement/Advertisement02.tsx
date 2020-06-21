import { Affix } from "antd";
import React, { FC, useEffect, useState } from "react";
import { websiteAdvertisement } from "../../utils/httpClient";

// 样式
import "./advertisement.css";

export const Advertisement02: FC = (props) => {
  const [advertisement, setAdvertisement] = useState(() => {
    return `
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
    `;
  });

  useEffect(() => {
    websiteAdvertisement().then(result => {
      setAdvertisement(result.data.data);
    });
  }, []);

  return (
    <Affix offsetTop={55}>
      <div className="uranus-card" dangerouslySetInnerHTML={{ __html: advertisement }} />
    </Affix>
  );
};