import { SketchOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";
import React, { FC } from "react";
import styled from "styled-components";

// 样式
import "../components.css";
import { ExpectIcon } from "./ExpectIcon";
import { MusicIcon } from "./MusicIcon";
import { QRCodeIcon } from "./QRCodeIcon";

const MagicBoxContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const MagicBox: FC = (props) => {
  return (
    <div className="uranus-card">
      <Card title="更多功能" size="small" extra={<SketchOutlined />}>
        <MagicBoxContent>
          <a href="/uranus-music" target="_blank" rel="noopener noreferrer">
            <Tooltip title="腾讯音乐、网易云音乐VIP格式解码">
              <MusicIcon />
            </Tooltip>
          </a>
          <span>
            <Tooltip title="文字转二维码">
              <QRCodeIcon />
            </Tooltip>
          </span>
          <span>
            <ExpectIcon />
          </span>
          <span>
            <ExpectIcon />
          </span>
        </MagicBoxContent>
      </Card>
    </div>
  );
};