import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import React, { FC, useCallback, useState } from "react";

interface ISignUpProps {
  switchMode: () => void;
}

export const SignUp: FC<ISignUpProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onUserNameChange = useCallback(() => {
    //
  }, []);

  const onPasswordChange = useCallback(() => {
    //
  }, []);

  const onSignUpClick = useCallback(() => {
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
      <Input.Password
        size="large"
        placeholder="确认密码"
        prefix={<KeyOutlined className="uranus-auth-prefix" />}
        onChange={onPasswordChange}
      />
      <Button type="primary" size="large" loading={loading} block onClick={onSignUpClick}>
        注册
      </Button>
      <Button type="link" size="large" block onClick={props.switchMode}>
        已有账号登录
      </Button>
      <p>
        注册登录即表示同意<b>用户协议</b>、<b>隐私政策</b>
      </p>
    </Space>
  );
};