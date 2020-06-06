import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import {
  GithubOutlined,
  QqOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Input, message, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useSafeProps, useSetState } from "../../utils/commonHooks";
import { signIn } from "../../utils/httpClient";
import { AuthMode } from "./SignUp";

const dividerStyle = { margin: 0, fontSize: '14px', fontWeight: 500 };

interface ISignInProps {
  switchMode: (m: AuthMode) => void;
}

interface ISignInState {
  username: string;
  password: string;
}

export const SignIn: FC<ISignInProps> = (props) => {
  const safeProps = useSafeProps<ISignInProps>(props);

  const [loading, setLoading] = useState<boolean>(false);
  const [signInState, setSignInState] = useSetState<ISignInState>({ username: '', password: '' });
  
  const onUserNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInState({ username: event.target.value });
  }, []);

  const onPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSignInState({ password: event.target.value });
  }, []);

  const signUp = useCallback(() => {
    safeProps.current.switchMode(AuthMode.signup);
  }, []);

  const resetPassword = useCallback(() => {
    safeProps.current.switchMode(AuthMode.resetPassword);
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

      await signIn({ username, password });

      message.success('登录成功');
    } catch (ex) {
      message.error(ex.message);
    } finally {
      setLoading(false);
    }
  }, [signInState]);

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
        <Avatar className="uranus-auth-third-item" size={33} icon={<GithubOutlined />} />
      </div>
    </Space>
  );
};