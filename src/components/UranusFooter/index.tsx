import "aplayer/dist/APlayer.min.css";
import React, { FC } from "react";
import "./uranusFooter.css";

export const UranusFooter: FC = (props) => {

  return (
    <div>
      <div className="uranus-footer">
        <span className="uranus-footer-item">关于吼吼</span>
        <span className="uranus-footer-item">意见反馈</span>
        <span className="uranus-footer-item">帮助中心</span>
        <span className="uranus-footer-item">©3020 Houhou </span>
        <span className="uranus-footer-item">京公网安备11000002000001号</span>
      </div>
    </div>
  );
};