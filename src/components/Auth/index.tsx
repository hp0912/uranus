import { Modal } from "antd";
import React, { FC, useCallback, useState } from "react";
import "./auth.css";
// import { SignUp } from "./SignUp";
// import { ResetPassword } from "./ResetPassword";
import { SignIn } from "./SignIn";

export enum AuthMode {
  signup = 'signup',
  signin = 'signin',
}

interface IAuthProps {
  mode: AuthMode;
  visible: boolean;
  onCancel: () => void;
}

export const Auth: FC<IAuthProps> = (props) => {
  const [mode, setMode] = useState<AuthMode>(props.mode);

  const switchMode = useCallback(() => {
    if (mode === AuthMode.signup) {
      setMode(AuthMode.signin);
    } else {
      setMode(AuthMode.signup);
    }
  }, [mode]);

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
      <SignIn switchMode={switchMode} />
    </Modal>
  );
};