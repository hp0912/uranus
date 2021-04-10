import { Modal } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export const UranusPrompt = (props: { hasChange: boolean }) => {
  const router = useRouter();
  const [{ nextRoute, confirmed }, setNextRoute] = useState<{ nextRoute: string | null, confirmed: boolean }>({ nextRoute: null, confirmed: false });
  const nextState = useRef(props.hasChange);

  nextState.current = props.hasChange;


  const onConfirm = useCallback(() => setNextRoute({ nextRoute, confirmed: true }), [nextRoute]);
  const onCancel = useCallback(() => setNextRoute({ nextRoute: null, confirmed: false }), []);

  useEffect(() => {
    const onRouteChangeStart = (route: string) => {
      if (!nextState.current) {
        return;
      }
      setNextRoute({ nextRoute: route, confirmed: false });
      router.events.emit('routeChangeError');
      throw '内容未保存，取消跳转...';
    };

    const cleanUpFunction = () => router.events.off('routeChangeStart', onRouteChangeStart);

    if (nextRoute && confirmed) {
      router.push(nextRoute);
      return cleanUpFunction;
    }

    router.events.on('routeChangeStart', onRouteChangeStart);

    return cleanUpFunction
  }, [nextRoute, confirmed]);

  return (
    <Modal
      title="当前内容未保存"
      visible={!!nextRoute}
      onOk={onConfirm}
      onCancel={onCancel}
    >
      <p>当前内容未保存，确定离开吗？</p>
    </Modal>
  );
}