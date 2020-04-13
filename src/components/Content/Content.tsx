import { Col, Row } from "antd";
import React, { FC, ReactElement } from "react";
import "./content.css";

interface IContentProps {
  left: ReactElement;
  right: ReactElement;
}

export const Content: FC<IContentProps> = (props) => {
  return (
    <Row className="uranus-content">
      <Col xs={0} md={3} />
      <Col xs={0} md={3} className="uranus-content-left">
        { props.left }
      </Col>
      <Col xs={24} md={12}>
        { props.children }
      </Col>
      <Col xs={0} md={3} className="uranus-content-right">
        { props.right}
      </Col>
      <Col xs={0} md={3} />
    </Row>
  );
};