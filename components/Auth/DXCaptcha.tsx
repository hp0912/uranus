import { Modal } from 'antd';
import React, { FC, useEffect } from 'react';

export interface IDXCaptchaProps {
  style?: React.CSSProperties;
  getDXRef: (dx: any) => void;
  callback: (token: string) => void;
}

function DXLoader() {
  if (typeof (window as any)._dx === 'undefined') {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.dingxiang-inc.com/ctu-group/captcha-ui/index.js';
      document.body.appendChild(script);
      script.onload = () => {
        resolve();
      };
      script.onerror = () => {
        reject();
      }
    });
  }

  return Promise.resolve();
}

const DXCaptcha: FC<IDXCaptchaProps> = ((props) => {
  const dxContainer = React.createRef<HTMLDivElement>();

  useEffect(() => {
    DXLoader().then(() => {
      const dx = (window as any)._dx.Captcha(dxContainer.current, {
        appId: 'a324bc0091f1e54023f51aa4f204d9b4',
        width: dxContainer.current?.clientWidth,
        success: props.callback,
      });
      props.getDXRef(dx);
    }).catch((reason) => {
      Modal.error({
        title: '初始化登录验证码失败',
        content: `${reason.message}，请重新刷新页面`,
      });
    });
  }, []);

  return <div style={props.style} ref={dxContainer} />;
});

export default DXCaptcha;