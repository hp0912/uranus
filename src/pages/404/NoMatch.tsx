import { Button, Result } from 'antd';
import React from 'react';
import { Header } from '../../components/Header';

export default (props) => {
  return (
    <>
      <Header />
      <Result
        status="404"
        className="uranus-404"
        title="404"
        subTitle="亲, 页面不见了呢..."
        extra={<Button type="primary" href="/">返回首页</Button>}
      />
    </>
  );
};