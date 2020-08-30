import { Avatar, Modal } from "antd";
import React, { FC, useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import url from 'url';
import { Header } from "../../components/Header";
import { browserDetect } from "../../utils";
import { githubOAuth } from "../../utils/httpClient";

// 图标
import { GithubOutlined, StopOutlined } from "@ant-design/icons";

// 样式
import './index.css';

export enum ThirdParty {
  github = 'github',
}

export const ThirdPartyOAuth: FC = (props) => {
  const params = useParams<{ thirdParty: ThirdParty }>();
  const history = useHistory();
  const loca = useLocation();

  const [thirdPartyState] = useState<ThirdParty>(() => {
    return params.thirdParty;
  });

  useEffect(() => {
    const json = url.parse(loca.search, true, false);
    const query = json.query;

    if (typeof query.code === 'string') {
      githubOAuth(query.code).then(() => {
        const { browser } = browserDetect(window.navigator.userAgent);
        const URL = window.localStorage.getItem("OAUTH_LOGIN_URL");

        if (browser.wechat && URL) {
          window.location.href = URL;
        } else {
          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              history.go(-1);
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
  }, [loca.search, history]);

  return (
    <>
      <Header />
      <div style={{ height: "calc(100vh - 40px)", paddingTop: 50, marginBottom: 40 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", padding: 10, textAlign: "center" }}>
          {
            thirdPartyState === ThirdParty.github ?
              (
                <>
                  <Avatar className="uranus-oauth" size={80} icon={<GithubOutlined />} />
                  <p style={{ marginTop: 15, fontWeight: 600, color: "#fff" }}>GitHub授权登录中，请稍候～</p>
                </>
              ) :
              (
                <>
                  <Avatar className="uranus-oauth" size={80} icon={<StopOutlined />} />
                  <p style={{ marginTop: 15, fontWeight: 600, color: "#fff" }}>非法的请求</p>
                </>
              )
          }
        </div>
      </div>
    </>
  );
};