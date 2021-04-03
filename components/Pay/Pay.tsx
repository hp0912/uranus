import { AlipayOutlined, QuestionCircleOutlined, WechatOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Row, Select, Tooltip } from 'antd';
import QRCode from 'qrcode.react';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import url from 'url';
import { IOrderEntity, PayCode, PayMethod, PayType } from '../../types';
import { browserDetect, IBrowserDetect, IOSDetect } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { initPay, queryPayStatus } from '../../utils/httpClient';

// 样式
import styles from './pay.module.css';

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

interface IPayData {
  mchid: string; // 平台分配商户号
  out_trade_no: string; // 用户端自主生成的订单号
  total_fee: number; // 单位：分
  body: string; // 商品描述
  notify_url: string; // 通知回调地址
  type: PayType;
  goods_detail?: string; // 商品详情
  attach?: string; // 附加的其他参数
  nonce_str: string; // 随机字符串 增加安全性
  sign: string; // 签名
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
}

interface IScanPayResponse extends IPayResponse {
  code_url: string;
}

interface IWAPPayResponse extends IPayResponse {
  mweb_url: string;
}

interface ICashierPayData extends IPayData {
  redirect_url: string;
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
  const [wechatH5State, setWechatH5State] = useState<{ mweb_url: string, nonce_str: string, prepay_id: string, package: string }>({
    mweb_url: '',
    nonce_str: '',
    prepay_id: '',
    package: '',
  });
  const [cashierState, setCashierState] = useState<ICashierPayData>({
    mchid: '',
    out_trade_no: '',
    total_fee: 0,
    body: '',
    notify_url: '',
    type: PayType.WeChatPay,
    goods_detail: '',
    nonce_str: '',
    sign: '',
    redirect_url: '',
  });

  const payStatusTimer = useRef(0);
  const cashierForm = React.createRef<HTMLFormElement>();
  const wechatH5Form = React.createRef<HTMLFormElement>();

  useEffect(() => {
    return () => {
      clearInterval(payStatusTimer.current);
    };
  }, []);

  useEffect(() => {
    if (cashierState.nonce_str) {
      cashierForm.current?.submit();
    }
    // eslint-disable-next-line
  }, [cashierState.nonce_str]);

  useEffect(() => {
    if (wechatH5State.nonce_str) {
      wechatH5Form.current?.submit();
    }
    // eslint-disable-next-line
  }, [wechatH5State.nonce_str]);

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

      const q = url.parse(window.location.search, true, false);
      const qo = q.query;
      const payResult = await initPay({ orderId: order!.id!, payType: PayType.WeChatPay, payMethod, token: qo.token as string });

      if (payMethod === PayMethod.scan) {
        const pay: IScanPayResponse = payResult.data.data;
        const QRCodeURL = pay.code_url;
        setPayState({ payType: PayType.WeChatPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true, QRCodeURL });
        payStatusTimer.current = window.setInterval(queryStatus, 3000, order!.id!);
      } else if (payMethod === PayMethod.wap) {
        const pay: IWAPPayResponse = payResult.data.data;
        const strArr = pay.mweb_url.split('?');
        const json = url.parse('?' + strArr[1], true, false);
        const query = json.query;

        setWechatH5State({
          nonce_str: pay.nonce_str,
          mweb_url: strArr[0],
          prepay_id: query.prepay_id as string,
          package: query.package as string,
        });
      } else if (payMethod === PayMethod.cashier) {
        const pay: ICashierPayData = payResult.data.data;
        setCashierState(pay);
      }
    } catch (ex) {
      props.onCancel();
      Modal.error({
        title: '错误',
        content: ex.message,
      });
    }
    // eslint-disable-next-line
  }, [payMethod, order!.id, queryStatus, props.onCancel]);

  const onAlipayClick = useCallback(async () => {
    try {
      clearInterval(payStatusTimer.current);
      setPayState({ payType: null, wechatPayLoading: false, aliPayLoading: true, QRCodeVisible: false });

      const q = url.parse(window.location.search, true, false);
      const qo = q.query;
      const payResult = await initPay({ orderId: order!.id!, payType: PayType.AliPay, payMethod, token: qo.token as string });

      if (payMethod === PayMethod.scan) {
        const pay: IScanPayResponse = payResult.data.data;
        const QRCodeURL = pay.code_url;
        setPayState({ payType: PayType.AliPay, wechatPayLoading: false, aliPayLoading: false, QRCodeVisible: true, QRCodeURL });
        payStatusTimer.current = window.setInterval(queryStatus, 3000, order!.id!);
      } else if (payMethod === PayMethod.cashier) {
        const pay: ICashierPayData = payResult.data.data;
        setCashierState(pay);
      }
    } catch (ex) {
      props.onCancel();
      Modal.error({
        title: '错误',
        content: ex.message,
      });
    }
    // eslint-disable-next-line
  }, [payMethod, order!.id, queryStatus, props.onCancel]);

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
      className={styles.uranus_pay}
      title={title.length > 15 ? title.substr(0, 15) + '...' : title}
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
            <Row className="uranus-row" style={{ rowGap: 0 }}>
              <Col className={styles.pay_item_left} span={8}>支付总额</Col>
              <Col className={styles.pay_item_right} span={16}>¥ {order.totalPrice! / 100} 元</Col>
            </Row>
            <Row className="uranus-row" style={{ rowGap: 0 }}>
              <Col className={styles.pay_item_left} span={8}>
                <span style={{ paddingRight: 4 }}>支付方式</span>
                <Tooltip
                  title={
                    (
                      <div>
                        <p className={styles.pay_method_tips}>二维码支付：二维码支付是指用户通过微信、支付宝扫码完成支付的模式</p>
                        <p className={styles.pay_method_tips}>H5支付：H5支付主要是在手机等移动设备中通过浏览器来唤起微信或支付宝支付</p>
                        <p className={styles.pay_method_tips}>微信收银台：在微信浏览器内调用微信支付模块完成支付</p>
                      </div>
                    )
                  }
                >
                  <QuestionCircleOutlined style={{ color: 'red' }} />
                </Tooltip>
              </Col>
              <Col span={16} className={styles.pay_item_right}>
                <Select className={styles.pay_method} bordered={false} value={payMethod} onChange={onPayMethodChange}>
                  <Select.Option value={PayMethod.scan}>二维码支付</Select.Option>
                  {
                    browserState.os.phone && !browserState.browser.wechat && // 手机端非微信浏览器
                    <Select.Option value={PayMethod.wap}>H5支付</Select.Option>
                  }
                  {
                    browserState.os.phone && // 手机端
                    <Select.Option disabled={!browserState.os.phone} value={PayMethod.cashier}>收银台</Select.Option>
                  }
                </Select>
              </Col>
            </Row>
            <Row style={{ rowGap: 0 }} className={`uranus-row ${payMethod === PayMethod.cashier && !browserState.browser.wechat ? 'uranus-pay-hidden' : ''}`}>{/** 微信收银台只能在微信内使用 */}
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
            <Row style={{ rowGap: 0 }} className={`uranus-row ${payMethod === PayMethod.wap || (payMethod === PayMethod.cashier && browserState.browser.wechat) ? 'uranus-pay-hidden' : ''}`}>{/** 支付宝的H5支付使用收银台接口, 微信内无法使用支付宝收银台 */}
              <Col span={24}>
                <Button
                  type="primary"
                  size="large"
                  loading={payState.aliPayLoading}
                  block
                  onClick={onAlipayClick}
                  disabled={payState.wechatPayLoading}
                  icon={<AlipayOutlined />}
                >
                  支付宝支付
                </Button>
              </Col>
            </Row>
          </div>
        )
      }
      {
        payState.QRCodeVisible &&
        (
          <div>
            <Row className="uranus-row" style={{ rowGap: 0 }}>
              <Col span={24}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <QRCode
                    value={payState.QRCodeURL!}
                    size={250}
                    fgColor="#000000"
                  />
                </div>
              </Col>
            </Row>
            <Row className="uranus-row" style={{ rowGap: 0 }}>
              <Col span={24}>
                <div className={styles.pay_tips}>
                  {
                    payState.payType === PayType.WeChatPay &&
                    <><WechatOutlined className={styles.wechat_pay_icon} /><span style={{ paddingLeft: 8 }}>微信扫码支付</span></>
                  }
                  {
                    payState.payType === PayType.AliPay &&
                    <><AlipayOutlined className={styles.ali_pay_icon} /><span style={{ paddingLeft: 8 }}>支付宝扫码支付</span></>
                  }
                </div>
              </Col>
            </Row>
            <Row style={{ rowGap: 0 }}>
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
      <form action={`https://admin.xunhuweb.com${cashierState.type === PayType.WeChatPay ? '/pay/cashier' : '/alipaycashier'}`} method="get" ref={cashierForm}>
        <input type="hidden" name="mchid" value={cashierState.mchid} />
        <input type="hidden" name="out_trade_no" value={cashierState.out_trade_no} />
        <input type="hidden" name="total_fee" value={cashierState.total_fee} />
        <input type="hidden" name="body" value={cashierState.body} />
        <input type="hidden" name="notify_url" value={cashierState.notify_url} />
        <input type="hidden" name="redirect_url" value={cashierState.redirect_url} />
        <input type="hidden" name="type" value={cashierState.type} />
        <input type="hidden" name="nonce_str" value={cashierState.nonce_str} />
        <input type="hidden" name="sign" value={cashierState.sign} />
      </form>
      <form action={wechatH5State.mweb_url} method="get" ref={wechatH5Form}>
        <input type="hidden" name="prepay_id" value={wechatH5State.prepay_id} />
        <input type="hidden" name="package" value={wechatH5State.package} />
      </form>
    </Modal>
  );
};