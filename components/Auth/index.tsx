import { Modal } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { ResetPassword } from './ResetPassword';
import { SignIn } from './SignIn';
import { AuthMode, SignUp } from './SignUp';

// 样式
import styles from './auth.module.css';

interface IAuthProps {
  mode: AuthMode;
  visible: boolean;
  onCancel: () => void;
}

export const Auth: FC<IAuthProps> = (props) => {
  const [mode, setMode] = useState<AuthMode>(props.mode);

  useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);

  const switchMode = useCallback((m: AuthMode) => {
    setMode(m);
  }, []);

  let title: string | null = null;

  switch (mode) {
    case AuthMode.signup:
      title = '注册';
      break;
    case AuthMode.signin:
      title = '登录';
      break;
    case AuthMode.resetPassword:
      title = '重置密码';
      break;
  }

  return (
    <Modal
      className={styles.auth}
      title={title}
      visible={props.visible}
      destroyOnClose
      centered
      footer={null}
      onCancel={props.onCancel}
    >
      {
        mode === AuthMode.signup ?
          <SignUp switchMode={switchMode} /> :
          mode === AuthMode.signin ?
            <SignIn switchMode={switchMode} onCancel={props.onCancel} /> :
            mode === AuthMode.resetPassword ?
              <ResetPassword switchMode={switchMode} /> :
              null
      }
    </Modal>
  );
};