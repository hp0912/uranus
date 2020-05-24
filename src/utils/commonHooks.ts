import { MutableRefObject, useCallback, useRef, useState } from "react";


export const useSafeProps: <T>(props: T) => MutableRefObject<T> = (props) => {
  const safeProps = useRef(props);
  safeProps.current = props;

  return safeProps;
};

export const useSetState = <S extends object>(
  initalState: S | (() => S),
): [S, (state: Partial<S> | ((state: S) => Partial<S>)) => void] => {
  const [_state, _setState] = useState<S>(initalState);

  const setState = useCallback((state: Partial<S> | ((state: S) => Partial<S>)) => {
    _setState((prev: S) => {
      let nextState = state;

      if (typeof state === 'function') {
        nextState = state(prev);
      }

      return { ...prev, ...nextState };
    });
  }, []);

  return [_state, setState];
};