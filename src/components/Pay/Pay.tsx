import { AlipayOutlined, QuestionCircleOutlined, WechatOutlined } from "@ant-design/icons";
import { Button, Col, message, Modal, Row, Select, Tooltip } from "antd";
import React, { FC, useCallback, useState } from "react";
import { IOrderEntity, PayMethod, PayType } from "../../types";
import { initPay } from "../../utils/httpClient";

// 样式
import './pay.css';

interface IPayProps {
  title: string;
  visible: boolean;
  order: IOrderEntity | null;
  onCancel: () => void;
}

interface IPayState {
  payType: PayType | null;
  wechatPayLoading: boolean;
  aliPayLoading: boolean;
  QRCodeVisible: boolean;
}

export const Pay: FC<IPayProps> = (props) => {
  const { title, visible, order } = props;

  const [payMethod, setPayMethod] = useState(PayMethod.scan);
  const [payState, setPayState] = useState<IPayState>({
    payType: null,
    wechatPayLoading: false,
    aliPayLoading: false,
    QRCodeVisible: false,
  });

  const onPayMethodChange = useCallback((value: PayMethod) => {
    setPayMethod(value);
  }, []);

  const onWechatClick = useCallback(async () => {
    try {
      setPayState({ payType: null, wechatPayLoading: true, aliPayLoading: false, QRCodeVisible: false });

      await initPay({ orderId: '5ef6daf7b6de5e1c0634d1eb', payType: PayType.WeChatPay, payMethod });

      setPayState({ payType: PayType.WeChatPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true });
    } catch (ex) {
      setPayState({ payType: PayType.WeChatPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true });
      message.error(ex.message);
    }
  }, [payMethod]);

  const onAlipayClick = useCallback(async () => {
    try {
      setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: true, QRCodeVisible: false });

      await initPay({ orderId: '5ef6daf7b6de5e1c0634d1eb', payType: PayType.AliPay, payMethod });

      setPayState({ payType: PayType.AliPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true });
    } catch (ex) {
      setPayState({ payType: PayType.AliPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true });
      message.error(ex.message);
    }
  }, [payMethod]);

  const onGobackClick = useCallback(() => {
    setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: false });
  }, []);

  const onCancel = useCallback(() => {
    props.onCancel();
    setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: false });
  }, [props.onCancel]);

  if (!visible || !order) {
    return null;
  }

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
      {
        !payState.QRCodeVisible &&
        (
          <div>
            <Row className="uranus-row">
              <Col className="pay-item-left" span={8}>支付总额</Col>
              <Col className="pay-item-right" span={16}>¥ {order.totalPrice! / 100} 元</Col>
            </Row>
            <Row className="uranus-row">
              <Col className="pay-item-left" span={8}>
                <span style={{ paddingRight: 4 }}>支付方式</span>
                <Tooltip
                  title={
                    (
                      <div>
                        <p className="pay-method-tips">二维码支付：二维码支付是指用户通过微信、支付宝扫码完成支付的模式</p>
                        <p className="pay-method-tips">H5支付：H5支付主要是在手机等移动设备中通过浏览器来唤起微信或支付宝支付</p>
                        <p className="pay-method-tips">微信收银台：在微信浏览器内调用微信支付模块完成支付</p>
                      </div>
                    )
                  }
                >
                  <QuestionCircleOutlined style={{ color: "red" }} />
                </Tooltip>
              </Col>
              <Col span={16} className="pay-item-right">
                <Select className="pay-method" bordered={false} value={payMethod} onChange={onPayMethodChange}>
                  <Select.Option value={PayMethod.scan}>二维码支付</Select.Option>
                  <Select.Option value={PayMethod.wap}>H5支付</Select.Option>
                  <Select.Option value={PayMethod.cashier}>微信收银台</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={24}>
                <Button
                  type="primary"
                  size="large"
                  loading={payState.wechatPayLoading}
                  block
                  onClick={onWechatClick}
                  disabled={payState.aliPayLoading}
                  icon={<WechatOutlined />}
                >
                  微信支付
                </Button>
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={24}>
                <Button
                  type="primary"
                  size="large"
                  loading={payState.aliPayLoading}
                  block
                  onClick={onAlipayClick}
                  disabled={payState.wechatPayLoading || payMethod === PayMethod.cashier}
                  icon={<AlipayOutlined />}
                >
                  支付宝支付
                </Button>
              </Col>
            </Row>
            <p style={{ color: "red", fontSize: 12 }}>温馨提示: 微信内打开推荐使用微信收银台付款</p>
          </div>
        )
      }
      {
        payState.QRCodeVisible &&
        (
          <div>
            <Row className="uranus-row">
              <Col span={24}>
                <div style={{ height: 230 }}>
                  123
                </div>
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={24}>
                <div className="pay-tips">
                  {
                    payState.payType === PayType.WeChatPay &&
                    <><WechatOutlined className="wechat-pay-icon" /><span style={{ paddingLeft: 8 }}>微信扫码支付</span></>
                  }
                  {
                    payState.payType === PayType.AliPay &&
                    <><AlipayOutlined className="ali-pay-icon" /><span style={{ paddingLeft: 8 }}>支付宝扫码支付</span></>
                  }
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={onGobackClick}
                >
                  返回
                </Button>
              </Col>
            </Row>
          </div>
        )
      }
    </Modal>
  );
};