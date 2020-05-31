import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import {
  GithubOutlined,
  QqOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Input, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { AuthMode } from "./SignUp";

const dividerStyle = { margin: 0, fontSize: '14px', fontWeight: 500 };

interface ISignInProps {
  switchMode: (m: AuthMode) => void;
}

export const SignIn: FC<ISignInProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onUserNameChange = useCallback(() => {
    //
  }, []);

  const onPasswordChange = useCallback(() => {
    //
  }, []);

  const onSignInClick = useCallback(() => {
    setLoading(true);
  }, []);

  return (
    <Space direction="vertical" size={12} className="uranus-auth-body">
      <Input
        size="large"
        placeholder="请输入手机号"
        prefix={<UserOutlined className="uranus-auth-prefix" />}
        onChange={onUserNameChange}
      />
      <Input.Password
        size="large"
        placeholder="请输入密码"
        prefix={<KeyOutlined className="uranus-auth-prefix" />}
        onChange={onPasswordChange}
      />
      <Button type="primary" size="large" loading={loading} block onClick={onSignInClick}>
        登录
      </Button>
      <div className="uranus-prompt-box">
        <span>
          没有账号? <a href="/">注册</a>
        </span>
        <a href="/">忘记密码</a>
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