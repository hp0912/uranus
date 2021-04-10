import { Carousel } from 'antd';
import React, { FC } from 'react';

const styles = {
  card: {
    width: '100%',
    background: '#fff',
    borderRadius: '4px',
    marginBottom: '8px',
  },
  advertisement01: {
    width: '100%',
    borderRadius: '4px',
  },
  wechatpay: {
    marginBottom: '-8px',
    width: '100%',
  },
  alipay: {
    marginBottom: '-8px',
    width: '100%',
  }
};

export const Advertisement01: FC = () => {
  return (
    <div style={styles.card}>
      <div>
        <img src="/images/provide.gif" alt="落魄前端，在线炒粉" style={styles.advertisement01} />
      </div>
      <Carousel autoplay>
        <div>
          <img src="/images/wechatpay.png" alt="微信支付" style={styles.wechatpay} />
        </div>
        <div>
          <img src="/images/alipay.png" alt="支付宝支付" style={styles.alipay} />
        </div>
      </Carousel>
    </div>
  );
};