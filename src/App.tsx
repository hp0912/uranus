import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import React, { FC, useEffect, useReducer } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { SkinContainer } from './components/SkinContainer';
import { UranusFooter } from './components/UranusFooter';
import UranusRoute from "./route";
import { reducer, SETUSER, UserContext } from './store/user';
import { IUserEntity } from "./types";
import { userStatus } from "./utils/httpClient";

const App: FC = () => {
  const [userState, userDispatch] = useReducer<(preState: IUserEntity | null, action: { type: string, data: IUserEntity | null }) => IUserEntity | null>(reducer, null);

  useEffect(() => {
    userStatus().then(result => {
      userDispatch({ type: SETUSER, data: result.data.data });
    });
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <UserContext.Provider value={{ userState, userDispatch }}>
        <SkinContainer />
        <Router>
          <UranusRoute />
        </Router>
        <UranusFooter />
      </UserContext.Provider>
    </ConfigProvider>
  );
};

export default App;
