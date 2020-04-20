import { Affix, Col, Row } from "antd";
import React, { FC, ReactElement } from "react";
import "./content.css";

interface IContentProps {
  left: ReactElement;
  right: ReactElement;
}

export const Content: FC<IContentProps> = (props) => {
  return (
    <Row className="uranus-content">
      <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={3} />
      <Col xs={0} sm={0} md={0} lg={5} xl={4} xxl={3}>
        <Affix offsetTop={55}>
          <div className="uranus-content-left">
            { props.left }
          </div>
        </Affix>
      </Col>
      <Col xs={24} sm={24} md={24} lg={14} xl={12} xxl={12} className="uranus-content-center">
        { props.children }
      </Col>
      <Col xs={0} sm={0} md={0} lg={5} xl={4} xxl={4}>
        <div className="uranus-content-right">
          { props.right}
        </div>
      </Col>
      <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2} />
    </Row>
  );
};