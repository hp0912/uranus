import { InboxOutlined } from '@ant-design/icons';
import React, { FC } from 'react';

export const CoverUploadButton: FC = (props) => {
  return (
    <div>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击上传文章封面</p>
    </div>
  );
};