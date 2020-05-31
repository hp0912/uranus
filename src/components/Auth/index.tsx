import { Modal } from "antd";
import React, { FC, useCallback, useState } from "react";
import { ResetPassword } from "./ResetPassword";
import { SignIn } from "./SignIn";
import { AuthMode, SignUp } from "./SignUp";

import "./auth.css";

interface IAuthProps {
  mode: AuthMode;
  visible: boolean;
  onCancel: () => void;
}

export const Auth: FC<IAuthProps> = (props) => {
  const [mode, setMode] = useState<AuthMode>(props.mode);

  const switchMode = useCallback((m: AuthMode) => {
    setMode(m);
  }, []);

  return (
    <Modal
      className="uranus-auth"
      title={mode === AuthMode.signup ? "注册" : "登录"}
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
        <SignIn switchMode={switchMode} /> :
        <ResetPassword switchMode={switchMode} />
      }
    </Modal>
  );
};