import { Breadcrumb } from 'antd';
import React, { FC } from 'react';

export const AdminArticleList: FC = (props) => {
  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>文章列表</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
        Bill is a cat.
      </div>
    </>
  );
};