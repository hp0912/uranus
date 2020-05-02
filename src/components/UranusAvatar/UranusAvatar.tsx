import {
  GithubOutlined,
  WechatOutlined,
  WeiboCircleOutlined,
  ZhihuOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Tooltip } from "antd";
import React, { FC } from "react";
import "../components.css";
import "./avatar.css";
import { WechatCount } from "./WechatCount";

const avatar = require("../../assets/images/avatar.jpg");

export const UranusAvatar: FC = (props) => {
  return (
    <div className="uranus-card">
      <div className="uranus-avatar-bg" />
      <div className="uranus-avatar">
        <Avatar className="uranus-avatar-image" size={90} src={avatar} />
        <p className="uranus-avatar-username">最后的轻语</p>
      </div>
      <div className="uranus-social-signal">
        <div className="social-signal-sub">
          <span className="social-signal-01">
            每日三省吾身，早中晚该吃啥
          </span>
        </div>
        <Divider>社交账号</Divider>
        <div className="social-signal-02">
          <a href="https://github.com/hp0912">
            <Avatar size={28} icon={<GithubOutlined />} className="social-signal-02-item" />
          </a>
          <a href="https://weibo.com/2573399657/profile">
            <Avatar size={28} icon={<WeiboCircleOutlined />} className="social-signal-02-item" />
          </a>
          <a href="https://www.zhihu.com/people/zui-hou-de-qing-yu-84">
            <Avatar size={28} icon={<ZhihuOutlined />} className="social-signal-02-item" />
          </a>
          <Tooltip title={<WechatCount />}>
            <Avatar size={28} icon={<WechatOutlined />} className="social-signal-02-item" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};