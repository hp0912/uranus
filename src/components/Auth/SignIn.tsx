import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import {
  GithubOutlined,
  QqOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Input, message, Modal, Space } from "antd";
import React, { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { SETUSER, UserContext } from "../../store/user";
import { useSafeProps, useSetState } from "../../utils/commonHooks";
import { signIn } from "../../utils/httpClient";
import { AuthMode } from "./SignUp";

const dividerStyle = { margin: 0, fontSize: '14px', fontWeight: 500 };

interface ISignInProps {
  switchMode: (m: AuthMode) => void;
  onCancel: () => void;
}

interface ISignInState {
  username: string;
  password: string;
}

export const SignIn: FC<ISignInProps> = (props) => {
  const userContext = useContext(UserContext);

  const safeProps = useSafeProps<ISignInProps>(props);

  const [loading, setLoading] = useState<boolean>(false);
  const [signInState, setSignInState] = useSetState<ISignInState>({ username: '', password: '' });
  const authTimer = useRef<number>();

  useEffect(() => {
    return () => {
      window.clearInterval(authTimer.current);
    };
  }, []);

  const onUserNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInState({ username: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInState({ password: event.target.value });
    // eslint-disable-next-line
  }, []);

  const signUp = useCallback(() => {
    safeProps.current.switchMode(AuthMode.signup);
    // eslint-disable-next-line
  }, []);

  const resetPassword = useCallback(() => {
    safeProps.current.switchMode(AuthMode.resetPassword);
    // eslint-disable-next-line
  }, []);

  const onSignInClick = useCallback(async () => {
    try {
      setLoading(true);
      const { username, password } = signInState;

      if (!username.match(/^[1][3578]\d{9}$/)) {
        throw new Error('请输入正确的手机号');
      }

      if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) {
        throw new Error('密码至少为6位，并且要同时包含大、小写字母和数字');
      }

      const result = await signIn({ username, password });

      if (userContext.userDispatch) {
        userContext.userDispatch({ type: SETUSER, data: result.data.data });
      }

      message.success('登录成功');
      setLoading(false);

      safeProps.current.onCancel();
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message,
      });
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [signInState]);

  const onGitHubOAuth = useCallback(() => {
    window.clearInterval(authTimer.current);
    window.localStorage.setItem("OAUTH_LOGIN_URL", window.location.href);

    const newWin = window.open('https://github.com/login/oauth/authorize?client_id=b0263da0ed583f782b96&redirect_uri=https://houhoukang.com/github/oauth/authorize');

    authTimer.current = window.setInterval(() => {
      if (newWin && newWin.closed) {
        window.clearInterval(authTimer.current);
        window.location.reload();
      }
    }, 300);
  }, []);

  return (
    <Space direction="vertical" size={12} className="uranus-auth-body">
      <Input
        size="large"
        placeholder="请输入手机号"
        prefix={<UserOutlined className="uranus-auth-prefix" />}
        value={signInState.username}
        onChange={onUserNameChange}
      />
      <Input.Password
        size="large"
        placeholder="请输入密码"
        prefix={<KeyOutlined className="uranus-auth-prefix" />}
        value={signInState.password}
        onChange={onPasswordChange}
      />
      <Button type="primary" size="large" loading={loading} block onClick={onSignInClick}>
        登录
      </Button>
      <div className="uranus-prompt-box">
        <span>
          没有账号?
          <Button
            type="link"
            onClick={signUp}
          >
            注册
          </Button>
        </span>
        <Button
          type="link"
          onClick={resetPassword}
        >
          忘记密码
        </Button>
      </div>
      <p style={{ marginBottom: 0 }}>
        注册登录即表示同意<b>用户协议</b>、<b>隐私政策</b>
      </p>
      <Divider style={dividerStyle}>第三方登录</Divider>
      <div className="uranus-auth-third">
        <Avatar className="uranus-auth-third-item" size={33} icon={<QqOutlined />} />
        <Avatar className="uranus-auth-third-item" size={33} icon={<WechatOutlined />} />
        <Avatar className="uranus-auth-third-item" size={33} icon={<GithubOutlined onClick={onGitHubOAuth} />} />
      </div>
    </Space>
  );
};