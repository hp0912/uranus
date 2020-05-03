import { EyeOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import React, { FC } from "react";
import "./articleActions.css";

export const ArticleActions: FC = (props) => {
  return (
    <div className="uranus-article-actions">
      <Space size="small">
        <span className="actions-item">
          <EyeOutlined /> 3390
        </span>
        <Divider type="vertical" />
        <span className="actions-item">
          <LikeOutlined /> 1288
        </span>
        <Divider type="vertical" />
        <span className="actions-item">
          <MessageOutlined /> 450
        </span>
      </Space>
    </div>
  );
};