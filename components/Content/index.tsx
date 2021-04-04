import { Col, Row } from 'antd';
import React, { FC, ReactElement } from 'react';

// 样式
import styles from './content.module.css';

interface IContentProps {
  left: ReactElement;
  right: ReactElement;
}

export const Content: FC<IContentProps> = (props) => {
  return (
    <Row className={styles.content} style={{ rowGap: 0 }}>
      <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={3} />
      <Col xs={0} sm={0} md={0} lg={5} xl={4} xxl={3}>
        <div className={styles.left}>
          {props.left}
        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={14} xl={12} xxl={12} className={styles.center}>
        {props.children}
      </Col>
      <Col xs={0} sm={0} md={0} lg={5} xl={4} xxl={4}>
        <div className={styles.right}>
          {props.right}
        </div>
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2} />
    </Row>
  );
};