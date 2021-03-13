import {
  GithubOutlined,
  WechatOutlined,
  WeiboCircleOutlined,
  ZhihuOutlined,
} from "@ant-design/icons";
import { Affix, Avatar, Divider, Tooltip } from "antd";
import React, { FC } from "react";
import { WechatCount } from "./WechatCount";

// 样式
import componentStyles from "../components.module.css";
import styles from "./avatar.module.css";

export const UranusAvatar: FC = (props) => {
  return (
    <Affix offsetTop={55}>
      <div className={componentStyles.uranus_card}>
        <div className={styles.uranus_avatar_bg} />
        <div className={styles.uranus_avatar}>
          <Avatar className={styles.uranus_avatar_image} size={90} src="/images/avatar.jpg" />
          <p className={styles.uranus_avatar_username}>最后的轻语</p>
        </div>
        <div className={styles.uranus_social_signal}>
          <div className={styles.social_signal_sub}>
            <span className={styles.social_signal_01}>
              每日三省吾身，早中晚该吃啥
          </span>
          </div>
          <Divider>社交账号</Divider>
          <div className={styles.social_signal_02}>
            <a href="https://github.com/hp0912">
              <Avatar size={28} icon={<GithubOutlined />} className={styles.social_signal_02_item} />
            </a>
            <a href="https://weibo.com/2573399657/profile">
              <Avatar size={28} icon={<WeiboCircleOutlined />} className={styles.social_signal_02_item} />
            </a>
            <a href="https://www.zhihu.com/people/zui-hou-de-qing-yu-84">
              <Avatar size={28} icon={<ZhihuOutlined />} className={styles.social_signal_02_item} />
            </a>
            <Tooltip title={<WechatCount />}>
              <Avatar size={28} icon={<WechatOutlined />} className={styles.social_signal_02_item} />
            </Tooltip>
          </div>
        </div>
      </div>
    </Affix>
  );
};