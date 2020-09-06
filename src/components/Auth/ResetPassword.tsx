import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message, Space } from "antd";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useSafeProps, useSetState } from "../../utils/commonHooks";
import { resetPassword, sendSms } from "../../utils/httpClient";
import { AuthMode } from "./SignUp";

interface IResetPasswordProps {
  switchMode: (m: AuthMode) => void;
}

interface ILoadingState {
  loading: boolean;
  smsLoading: boolean;
}

interface IResetPasswordState {
  username: string;
  password: string;
  confirmPassword: string;
  sms: string;
}

export const ResetPassword: FC<IResetPasswordProps> = (props) => {
  const safeProps = useSafeProps<IResetPasswordProps>(props);

  const [smsText, setSmsText] = useState('获取验证码');
  const [smsDisabled, setSmsDisabled] = useState(false);
  const [loadingState, setLoadingState] = useSetState<ILoadingState>({ loading: false, smsLoading: false });
  const [resetPasswordState, setResetPasswordState] = useSetState<IResetPasswordState>({
    username: '',
    password: '',
    confirmPassword: '',
    sms: '',
  });

  const smsSecond = useRef(60);
  const smsRef = useRef(0);

  useEffect(() => {
    return () => {
      if (smsRef.current) {
        clearInterval(smsRef.current);
      }
    };
  }, []);

  const switchMode = useCallback(() => {
    safeProps.current.switchMode(AuthMode.signin);
    // eslint-disable-next-line
  }, []);

  const onUserNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState({ username: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState({ password: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onConfirmPasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState({ confirmPassword: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSmsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setResetPasswordState({ sms: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSendSmsClick = useCallback(async () => {
    try {
      setLoadingState({ smsLoading: true });

      if (!resetPasswordState.username.match(/^[1][3578]\d{9}$/)) {
        throw new Error('请输入正确的手机号');
      }

      await sendSms({ phoneNumber: resetPasswordState.username });

      message.success('发送验证码成功');

      setSmsDisabled(true);
      setSmsText(`${smsSecond.current} s`);

      smsRef.current = setInterval(() => {
        if (smsSecond.current === 0) {
          setSmsDisabled(false);
          setSmsText('获取验证码');
          clearInterval(smsRef.current);

          smsSecond.current = 60;
        } else {
          setSmsText(`${--smsSecond.current} s`);
        }
      }, 1000);
    } catch (ex) {
      message.error(ex.message);
    } finally {
      setLoadingState({ smsLoading: false });
    }
    // eslint-disable-next-line
  }, [resetPasswordState.username]);

  const onResetPasswordClick = useCallback(async () => {
    try {
      setLoadingState({ loading: true });
      const { username, password, confirmPassword, sms } = resetPasswordState;

      if (!username.match(/^[1][3578]\d{9}$/)) {
        throw new Error('请输入正确的手机号');
      }

      if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/)) {
        throw new Error('密码至少为6位，并且要同时包含大、小写字母和数字');
      }

      if (password !== confirmPassword) {
        throw new Error('两次输入的密码不一致');
      }

      if (!sms.match(/^\d{6}$/)) {
        throw new Error('请输入正确的短信验证码');
      }

      await resetPassword({ username, password, smsCode: sms });

      message.success('重置密码成功');

      setTimeout(() => {
        switchMode(); // 切换到登录页
      }, 16);
    } catch (ex) {
      message.error(ex.message);
    } finally {
      setLoadingState({ loading: false });
    }
    // eslint-disable-next-line
  }, [resetPasswordState]);

  return (
    <Space direction="vertical" size={12} className="uranus-auth-body">
      <Input
        size="large"
        placeholder="请输入手机号"
        prefix={<UserOutlined className="uranus-auth-prefix" />}
        value={resetPasswordState.username}
        onChange={onUserNameChange}
      />
      <Input.Password
        size="large"
        placeholder="输入新密码"
        prefix={<KeyOutlined className="uranus-auth-prefix" />}
        value={resetPasswordState.password}
        onChange={onPasswordChange}
      />
      <Input.Password
        size="large"
        placeholder="确认新密码"
        prefix={<KeyOutlined className="uranus-auth-prefix" />}
        value={resetPasswordState.confirmPassword}
        onChange={onConfirmPasswordChange}
      />
      <Input
        size="large"
        placeholder="请输入验证码"
        value={resetPasswordState.sms}
        onChange={onSmsChange}
        addonAfter={(
          <Button type="link" loading={loadingState.smsLoading} disabled={smsDisabled} onClick={onSendSmsClick}>
            {smsText}
          </Button>
        )}
      />
      <Button type="primary" size="large" loading={loadingState.loading} block onClick={onResetPasswordClick}>
        重置密码
      </Button>
      <Button type="link" size="large" block onClick={switchMode}>
        返回登录
      </Button>
    </Space>
  );
};