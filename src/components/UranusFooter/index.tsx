import { BackTop } from "antd";
import React, { FC } from "react";

// 样式
import "aplayer/dist/APlayer.min.css";
import "./uranusFooter.css";

export const UranusFooter: FC = (props) => {

  return (
    <div>
      <div className="uranus-footer">
        <span className="uranus-footer-item">关于吼吼</span>
        <span className="uranus-footer-item">意见反馈</span>
        <span className="uranus-footer-item">帮助中心</span>
        <span className="uranus-footer-item">©3020 Houhou </span>
        <span className="uranus-footer-item">粤ICP备20050348号</span>
      </div>
      <BackTop />
    </div>
  );
};