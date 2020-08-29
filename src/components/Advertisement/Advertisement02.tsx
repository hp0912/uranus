import { Affix, message } from "antd";
import React, { FC, useEffect, useState } from "react";
import { websiteAdvertisement } from "../../utils/httpClient";

// 样式
import "./advertisement.css";

export const Advertisement02: FC = (props) => {
  const [advertisement, setAdvertisement] = useState(() => {
    return `
    <div>
      <img src="https://img.houhoukang.com/uranus/system/advertisement-03.jpg" alt="广告" width="100%" />
    </div>
    <div>
      <img src="https://img.houhoukang.com/uranus/system/advertisement-04.jpeg" alt="广告" width="100%" />
    </div>
    `;
  });

  useEffect(() => {
    websiteAdvertisement().then(result => {
      const a = result.data.data;
      if (a) {
        setAdvertisement(result.data.data);
      }
    }).catch(reason => {
      message.error(reason.message);
    });
  }, []);

  return (
    <Affix offsetTop={55}>
      <div className="uranus-card" dangerouslySetInnerHTML={{ __html: advertisement }} />
    </Affix>
  );
};