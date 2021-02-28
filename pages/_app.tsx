import { ConfigProvider, message } from "antd";
// import zhCN from 'antd/es/locale/zh_CN';
import React, { useEffect, useReducer, useRef } from 'react';
import { UranusSkin } from '../components/SkinContainer';
import { UranusFooter } from '../components/UranusFooter';
import { reducer, SETUSER, UserContext } from '../store/user';
import { IUserEntity } from "../types";
import { userStatus } from "../utils/httpClient";

// 样式
import '../styles/global.css'

export default function App<T extends { userState: IUserEntity | null }>({ Component, pageProps }: { Component: React.FunctionComponent, pageProps: T }) {
  const [userState, userDispatch] = useReducer<(
    preState: IUserEntity | null,
    action: { type: string, data: IUserEntity | null },
  ) => IUserEntity | null>(reducer, pageProps.userState);

  const userStateRef = useRef<IUserEntity | null>(pageProps.userState);

  useEffect(() => {
    if (!userStateRef.current) {
      userStatus().then(result => {
        userDispatch({ type: SETUSER, data: result.data.data });
      }).catch(reason => {
        message.error(reason.message);
      });
    }
  }, []);

  return (
    // <ConfigProvider locale={zhCN}>
    <UserContext.Provider value={{ userState, userDispatch }}>
      <UranusSkin />
      <Component {...pageProps} />
      <UranusFooter />
    </UserContext.Provider>
    // </ConfigProvider>
  );
}
