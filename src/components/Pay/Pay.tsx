import { Modal } from "antd";
import React, { FC } from "react";

// 样式
import './pay.css';

interface IPayProps {
  title: string;
  visible: boolean;
  onCancel: () => void;
}

export const Pay: FC<IPayProps> = (props) => {
  const { title, visible, onCancel } = props;

  return (
    <Modal
      className="uranus-pay"
      title={title.length > 15 ? title.substr(0, 15) + "..." : title}
      visible={visible}
      destroyOnClose
      centered
      footer={null}
      onCancel={onCancel}
    >
      <div>123</div>
    </Modal>
  );
};