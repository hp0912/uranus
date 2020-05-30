import { Breadcrumb, Col, Input, Row, Select } from 'antd';
import React, { FC, useCallback } from 'react';
import { ArticleTagSelect } from './ArticleTagSelect';
import { CoverUpload } from './CoverUpload';
// import { IArticleEntity } from '../../types';
// import { useSetState } from '../../utils/commonHooks';

export const AdminArticleAdd: FC = (props) => {
  const onArticleTagChange = useCallback((v1) => {
    console.log(v1);
  }, []);

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
        <Row>
          <Col span={24}>
            <CoverUpload />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24}>
            <ArticleTagSelect
              tagOptions={[]}
              onChange={onArticleTagChange}
            />
          </Col>
        </Row>
        <Row className="uranus-row">
          <Col span={24}>
            <Select placeholder="文章可见范围" className="uranus-row-select">
              <Select.Option value={0}>
                仅自己可见
              </Select.Option>
              <Select.Option value={1}>
                所有人可见
              </Select.Option>
            </Select>
          </Col>
        </Row>
      </div>
    </>
  );
};