import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { useSafeProps } from "../../utils/commonHooks";
import { AuthMode } from "./SignUp";

interface IResetPasswordProps {
  switchMode: (m: AuthMode) => void;
}

export const ResetPassword: FC<IResetPasswordProps> = (props) => {
  const safeProps = useSafeProps<IResetPasswordProps>(props);

  const [loading, setLoading] = useState<boolean>(false);

  const switchMode = useCallback(() => {
    safeProps.current.switchMode(AuthMode.signup);
  }, []);

  const onUserNameChange = useCallback(() => {
    //
  }, []);

  const onPasswordChange = useCallback(() => {
    //
  }, []);

  const onResetPasswordClick = useCallback(() => {
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
      <Input
        size="large"
        placeholder="请输入验证码"
        onChange={onUserNameChange}
        addonAfter={(
          <Button type="link" loading={loading} onClick={onResetPasswordClick}>
            获取验证码
          </Button>
        )}
      />
      <Input.Password
        size="large"
        placeholder="确认新密码"
        prefix={<KeyOutlined className="uranus-auth-prefix" />}
        onChange={onPasswordChange}
      />
      <Button type="primary" size="large" loading={loading} block onClick={onResetPasswordClick}>
        确认
      </Button>
      <Button type="link" size="large" block onClick={switchMode}>
        返回登录
      </Button>
    </Space>
  );
};