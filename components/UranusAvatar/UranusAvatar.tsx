import {
  GithubOutlined,
  WechatOutlined,
  WeiboCircleOutlined,
  ZhihuOutlined,
} from '@ant-design/icons';
import { Affix, Avatar, Divider, Tooltip } from 'antd';
import React, { FC } from 'react';
import { WechatCount } from './WechatCount';

// 样式
import componentStyles from '../components.module.css';
import styles from './avatar.module.css';

export const UranusAvatar: FC = () => {
  return (
    <Affix offsetTop={55}>
      <div className={componentStyles.uranus_card}>
        <div className={styles.bg} />
        <div className={styles.avatar}>
          <Avatar className={styles.image} size={90} src="https://img.houhoukang.com/uranus/system/avatar.jpeg" />
          <p className={styles.username}>最后的轻语</p>
        </div>
        <div className={styles.social_signal}>
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