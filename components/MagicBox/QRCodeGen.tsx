import { Button, Col, Input, Modal, Row, Tooltip } from "antd";
import QRCode from 'qrcode.react';
import React, { FC, useCallback, useState } from "react";
import { QRCodeIcon } from "./QRCodeIcon";

export const QRCodeGen: FC = (props) => {
  const [visible, setVisible] = useState(false);
  const [Imgvisible, setImgVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [QRCodeText, setQRCodeText] = useState('');
  const [QRCodeURL, setQRCodeURL] = useState('');

  const onShow = useCallback(() => {
    setVisible(true);
  }, []);

  const onCancel = useCallback(() => {
    setVisible(false);
    setLoading(false);
    setImgVisible(false);
    setQRCodeText('');
  }, []);

  const onQRCodeTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQRCodeText(event.target.value);
  }, []);

  const onGenClick = useCallback(() => {
    setLoading(true);
    setImgVisible(false);
    setQRCodeURL(QRCodeText);
    setLoading(false);
    setImgVisible(true);
  }, [QRCodeText]);

  return (
    <>
      <Tooltip title="文字转二维码">
        <QRCodeIcon onClick={onShow} />
      </Tooltip>
      <Modal
        visible={visible}
        title="文字转二维码"
        destroyOnClose
        footer={null}
        onCancel={onCancel}
      >
        <Row style={{ rowGap: 0 }}>
          <Col span={19}>
            <Input
              value={QRCodeText}
              placeholder="请输入要转换的文字"
              onChange={onQRCodeTextChange}
            />
          </Col>
          <Col span={5}>
            <Button type="primary" onClick={onGenClick} loading={loading}>开始生成</Button>
          </Col>
        </Row>
        {
          Imgvisible &&
          (
            <Row style={{ rowGap: 0 }}>
              <Col span={24}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 25 }}>
                  <QRCode
                    value={QRCodeURL}
                    size={250}
                    fgColor="#000000"
                  />
                </div>
              </Col>
            </Row>
          )
        }
      </Modal>
    </>
  );
};