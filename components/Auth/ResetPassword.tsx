import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Space } from 'antd';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSafeProps, useSetState } from '../../utils/commonHooks';
import { resetPassword, sendSms } from '../../utils/httpClient';
import { AuthMode } from './SignUp';

// 样式
import styles from './auth.module.css';

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

const DXCaptcha = dynamic(() => import('./DXCaptcha'), {
  ssr: false,
});

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
  const dxTokenRef = useRef<string>();
  const dxInstanceRef = useRef<any>();

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

      if (!dxTokenRef.current) {
        setLoadingState({ smsLoading: false });
        message.warn('请完成滑块验证');
        return;
      }

      await sendSms({ phoneNumber: resetPasswordState.username, token: dxTokenRef.current });

      message.success('发送验证码成功');

      setSmsDisabled(true);
      setSmsText(`${smsSecond.current} s`);

      smsRef.current = window.setInterval(() => {
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
      dxInstanceRef.current?.reload();
      Modal.error({
        title: '错误',
        content: ex.message,
      });
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
      Modal.error({
        title: '错误',
        content: ex.message,
      });
    } finally {
      setLoadingState({ loading: false });
    }
    // eslint-disable-next-line
  }, [resetPasswordState]);

  const dxCallback = useCallback((token: string) => {
    dxTokenRef.current = token;
  }, []);

  const getDXRef = useCallback((dx: any) => {
    dxInstanceRef.current = dx;
  }, []);

  return (
    <Space direction="vertical" size={12} className="uranus-width-100">
      <Input
        size="large"
        placeholder="请输入手机号"
        prefix={<UserOutlined className={styles.prefix} />}
        value={resetPasswordState.username}
        onChange={onUserNameChange}
      />
      <Input.Password
        size="large"
        placeholder="输入新密码"
        prefix={<KeyOutlined className={styles.prefix} />}
        value={resetPasswordState.password}
        onChange={onPasswordChange}
      />
      <Input.Password
        size="large"
        placeholder="确认新密码"
        prefix={<KeyOutlined className={styles.prefix} />}
        value={resetPasswordState.confirmPassword}
        onChange={onConfirmPasswordChange}
      />
      <DXCaptcha callback={dxCallback} getDXRef={getDXRef} />
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