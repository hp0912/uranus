import { SketchOutlined } from '@ant-design/icons';
import { Card, Tooltip } from 'antd';
import React, { FC } from 'react';
import { ExpectIcon } from './ExpectIcon';
import { MusicIcon } from './MusicIcon';
import { QRCodeGen } from './QRCodeGen';
import { Video2GIF } from './Video2GIF';

// 样式
import componentStyles from '../components.module.css';
import styles from './magicBox.module.css';

export const MagicBox: FC = () => {
  return (
    <div className={componentStyles.uranus_card}>
      <Card title="更多功能" size="small" extra={<SketchOutlined />}>
        <div className={styles.box_content}>
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
        </div>
      </Card>
    </div>
  );
};