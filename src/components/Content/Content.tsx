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
      <Col xs={0} md={2} />
      <Col xs={0} md={4}>
        <Affix offsetTop={55}>
          <div className="uranus-content-left">
            { props.left }
          </div>
        </Affix>
      </Col>
      <Col xs={24} md={12} className="uranus-content-center">
        { props.children }
      </Col>
      <Col xs={0} md={4}>
        <div className="uranus-content-right">
          { props.right}
        </div>
      </Col>
      <Col xs={0} md={2} />
    </Row>
  );
};