import { InboxOutlined } from '@ant-design/icons';
import React, { FC } from 'react';

// 样式
import styles from "./coverUpload.module.css";

export const CoverUploadButton: FC = (props) => {
  return (
    <div>
      <p className={styles["ant-upload-drag-icon"]}>
        <InboxOutlined />
      </p>
      <p className={styles["ant-upload-text"]}>点击上传文章封面</p>
    </div>
  );
};