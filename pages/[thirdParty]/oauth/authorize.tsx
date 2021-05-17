import { Avatar, Modal } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { browserDetect } from '../../../utils';
import { githubOAuth, qqOAuth } from '../../../utils/httpClient';

// 图标
import { GithubOutlined, StopOutlined, QqOutlined } from '@ant-design/icons';

// 样式
import styles from '../../../components/components.module.css';

export enum ThirdParty {
  github = 'github',
  qq = 'qq',
}

const ThirdPartyOAuth: FC = () => {
  const router = useRouter();
  const code = router.query.code;

  const [thirdPartyState] = useState<ThirdParty>(() => {
    return router.query.thirdParty as ThirdParty;
  });

  useEffect(() => {
    if (typeof code === 'string') {
      let oauth: (code: string) => Promise<any> = githubOAuth;
      switch (router.query.thirdParty) {
        case ThirdParty.github:
          oauth = githubOAuth;
          break;
        case ThirdParty.qq:
          oauth = qqOAuth;
          break;
      }

      oauth(code).then(() => {
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
            thirdPartyState === ThirdParty.qq ?
              (
                <>
                  <Avatar className={styles.uranus_oauth} size={80} icon={<QqOutlined />} />
                  <p style={{ marginTop: 15, fontWeight: 600, color: '#fff' }}>QQ授权登录中，请稍候～</p>
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { thirdParty: ThirdParty.github } },
      { params: { thirdParty: ThirdParty.qq } },
    ],
    fallback: false,
  };
}