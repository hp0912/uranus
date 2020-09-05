import { AlipayOutlined, QuestionCircleOutlined, WechatOutlined } from "@ant-design/icons";
import { Button, Col, message, Modal, Row, Select, Tooltip } from "antd";
import QRCode from 'qrcode.react';
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { IOrderEntity, PayCode, PayMethod, PayType } from "../../types";
import { browserDetect, IBrowserDetect, IOSDetect } from "../../utils";
import { useSetState } from "../../utils/commonHooks";
import { initPay, queryPayStatus } from "../../utils/httpClient";

// 样式
import './pay.css';

interface IPayProps {
  title: string;
  visible: boolean;
  order: IOrderEntity | null;
  onCancel: () => void;
  onSuccess?: () => Promise<void>;
}

interface IPayState {
  payType: PayType | null;
  wechatPayLoading: boolean;
  aliPayLoading: boolean;
  QRCodeVisible: boolean;
  QRCodeURL?: string;
}

interface IPayResponse {
  return_code: string;
  return_msg?: string;
  err_code?: string;
  err_msg?: string;
  nonce_str: string;
  sign: string;
  goods_detail?: string;
  mchid: string;
  order_id: string;
  out_trade_no: string;
  total_fee: string;
  code_url: string;
}

interface IScanPayResponse extends IPayResponse {
  code_url: string;
}

export const Pay: FC<IPayProps> = (props) => {
  const { title, visible, order } = props;

  const [browserState] = useState<{ browser: IBrowserDetect, os: IOSDetect }>(() => {
    return browserDetect(window.navigator.userAgent);
  });
  const [payMethod, setPayMethod] = useState(PayMethod.scan);
  const [payState, setPayState] = useSetState<IPayState>({
    payType: null,
    wechatPayLoading: false,
    aliPayLoading: false,
    QRCodeVisible: false,
    QRCodeURL: '',
  });

  const payStatusTimer = useRef(0);

  useEffect(() => {
    return () => {
      clearInterval(payStatusTimer.current);
    };
  }, []);

  const onPayMethodChange = useCallback((value: PayMethod) => {
    setPayMethod(value);
  }, []);

  const queryStatus = useCallback(async (orderId: string) => {
    const result = await queryPayStatus(orderId);
    const { code, status } = result.data.data;

    if (code === PayCode.success) {
      clearInterval(payStatusTimer.current);
      setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: false });
      if (props.onSuccess) {
        props.onSuccess();
      }
    } else if (code === PayCode.failure) {
      clearInterval(payStatusTimer.current);
      setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: false });
      message.error(status);
    }
    // eslint-disable-next-line
  }, [props.onSuccess]);

  const onWechatClick = useCallback(async () => {
    try {
      clearInterval(payStatusTimer.current);
      setPayState({ payType: null, wechatPayLoading: true, aliPayLoading: false, QRCodeVisible: false });

      const payResult = await initPay({ orderId: order!.id!, payType: PayType.WeChatPay, payMethod });
      const pay: IScanPayResponse = payResult.data.data;

      if (payMethod === PayMethod.scan) {
        const QRCodeURL = pay.code_url;
        setPayState({ payType: PayType.WeChatPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true, QRCodeURL });
        payStatusTimer.current = window.setInterval(queryStatus, 3000, order!.id!);
      }
    } catch (ex) {
      if (payMethod === PayMethod.scan) {
        setPayState({ payType: PayType.WeChatPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true });
      }
      message.error(ex.message);
    }
    // eslint-disable-next-line
  }, [payMethod, order!.id, queryStatus]);

  const onAlipayClick = useCallback(async () => {
    try {
      clearInterval(payStatusTimer.current);
      setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: true, QRCodeVisible: false });

      const payResult = await initPay({ orderId: order!.id!, payType: PayType.AliPay, payMethod });
      const pay: IScanPayResponse = payResult.data.data;

      if (payMethod === PayMethod.scan) {
        const QRCodeURL = pay.code_url;
        setPayState({ payType: PayType.AliPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true, QRCodeURL });
        payStatusTimer.current = window.setInterval(queryStatus, 3000, order!.id!);
      }
    } catch (ex) {
      if (payMethod === PayMethod.scan) {
        setPayState({ payType: PayType.AliPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true });
      }
      message.error(ex.message);
    }
    // eslint-disable-next-line
  }, [payMethod, order!.id, queryStatus]);

  const onGobackClick = useCallback(() => {
    clearInterval(payStatusTimer.current);
    setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: false });
    // eslint-disable-next-line
  }, []);

  const onCancel = useCallback(() => {
    clearInterval(payStatusTimer.current);
    props.onCancel();
    setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: false });
    // eslint-disable-next-line
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
                  <Select.Option disabled={!browserState.os.phone} value={PayMethod.wap}>H5支付</Select.Option>
                  <Select.Option disabled={!browserState.os.phone} value={PayMethod.cashier}>微信收银台</Select.Option>
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
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <QRCode
                    value={payState.QRCodeURL}
                    size={250}
                    fgColor="#000000"
                  />
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