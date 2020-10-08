import { SketchOutlined } from "@ant-design/icons";
import { Card, Tooltip } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import { ExpectIcon } from "./ExpectIcon";
import { MusicIcon } from "./MusicIcon";
import { QRCodeGen } from "./QRCodeGen";
import { Video2GIF } from "./Video2GIF";

// 样式
import "../components.css";

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
            <QRCodeGen />
          </span>
          <span>
            <Video2GIF />
          </span>
          <span>
            <ExpectIcon />
          </span>
        </MagicBoxContent>
      </Card>
    </div>
  );
};