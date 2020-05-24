import { Breadcrumb, Col, Input, Row } from 'antd';
import React, { FC } from 'react';
// import { IArticleEntity } from '../../types';
// import { useSetState } from '../../utils/commonHooks';

export const AdminArticleAdd: FC = (props) => {

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>编辑文章</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
        <Row>
          <Col span={24}>
            <Input placeholder="文章标题" />
          </Col>
        </Row>
      </div>
    </>
  );
};