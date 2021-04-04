import { Avatar, Modal } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { browserDetect } from '../../../utils';
import { githubOAuth } from '../../../utils/httpClient';

// 图标
import { GithubOutlined, StopOutlined } from '@ant-design/icons';

// 样式
import styles from './oauth.module.css';

export enum ThirdParty {
  github = 'github',
}

const ThirdPartyOAuth: FC = () => {
  const router = useRouter();
  const code = router.query.code;

  const [thirdPartyState] = useState<ThirdParty>(() => {
    return router.query.thirdParty as ThirdParty;
  });

  useEffect(() => {
    if (typeof code === 'string') {
      githubOAuth(code).then(() => {
        const { browser } = browserDetect(window.navigator.userAgent);
        const URL = window.localStorage.getItem('OAUTH_LOGIN_URL');

        if (browser.wechat && URL) {
          window.location.href = URL;
        } else {
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              router.back();
            }
          }, 3000);
        }
      }).catch(reason => {
        Modal.error({
          title: '授权失败',
          content: reason.message,
          onOk: () => {
            window.close();
          }
        });
      });
    }
  }, [code, router]);

  return (
    <div style={{ height: 'calc(100vh - 40px)', paddingTop: 50, marginBottom: 40 }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 10, textAlign: 'center' }}>
        {
          thirdPartyState === ThirdParty.github ?
            (
              <>
                <Avatar className={styles.uranus_oauth} size={80} icon={<GithubOutlined />} />
                <p style={{ marginTop: 15, fontWeight: 600, color: '#fff' }}>GitHub授权登录中，请稍候～</p>
              </>
            ) :
            (
              <>
                <Avatar className={styles.uranus_oauth} size={80} icon={<StopOutlined />} />
                <p style={{ marginTop: 15, fontWeight: 600, color: '#fff' }}>非法的请求</p>
              </>
            )
        }
      </div>
    </div>
  );
};

export default ThirdPartyOAuth;

export async function getStaticProps() {
  return {
    props: {
      userState: null,
    }
  };
}