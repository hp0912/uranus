import APlayer from "aplayer";
import "aplayer/dist/APlayer.min.css";
import React, { FC, useEffect } from "react";
import "./uranusFooter.css";

const audio01 = require("../../assets/audio/孤星独吟.mp3");
const audio02 = require("../../assets/audio/落入凡尘.mp3");

const audio01Cover = require("../../assets/images/audio01-theme.png");
const audio02Cover = require("../../assets/images/audio02-theme.png");

export const UranusFooter: FC = (props) => {

  useEffect(() => {
    const ap = new APlayer({
      container: document.getElementById('uranus-player'),
      fixed: true,
      // lrcType: 3,
      audio: [
        {
          name: '孤星独吟',
          artist: '李昊天',
          url: audio01,
          cover: audio01Cover,
          // lrc: 'lrc1.lrc',
          theme: '#ebd0c2'
        },
        {
          name: '落入凡尘',
          artist: '麦振鸿',
          url: audio02,
          cover: audio02Cover,
          // lrc: 'lrc2.lrc',
          theme: '#46718b'
        }
      ]
    });

    return () => {
      ap.destroy();
    };
  }, []);

  return (
    <div>
      <div id="uranus-player" />
      {/* <div className="uranus-footer">
        <span className="uranus-footer-item">关于吼吼</span>
        <span className="uranus-footer-item">意见反馈</span>
        <span className="uranus-footer-item">帮助中心</span>
        <span className="uranus-footer-item">©3020 Houhou </span>
        <span className="uranus-footer-item">京公网安备11000002000001号</span>
      </div> */}
    </div>
  );
};