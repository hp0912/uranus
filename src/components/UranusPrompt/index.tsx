import { Modal } from 'antd';
import React, { FC, useCallback, useRef } from "react";
import { Prompt } from "react-router-dom";

interface IUranusPromptProps {
  visible: boolean;
  title?: string;
  message?: string;
  hasChange?: () => boolean;
  onCancle: (nextRouter: string | null) => void;
  onConfirm: (nextRouter: string | null) => void;
}

export const UranusPrompt: FC<IUranusPromptProps> = (props) => {
  const { visible, title, message, hasChange, onConfirm, onCancle } = props;

  const nextRouter = useRef<string | null>(null);

  const onOk = useCallback(() => {
    onConfirm(nextRouter.current);
  }, [onConfirm]);

  const onCancel = useCallback(() => {
    onCancle(nextRouter.current);
  }, [onCancle]);

  return (
    <>
      <Modal
        title={title ? title : "当前内容未保存"}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
      >
        <p>{message ? message : "当前内容未保存，确定离开吗？"}</p>
      </Modal>
      <Prompt
        when={true}
        message={(location) => {
          nextRouter.current = location.pathname + location.search;
          const hasChanged = hasChange ? hasChange() : false;
          if (!hasChanged) {
            return true;
          }
          return false;
        }}
      />
    </>
  );
};