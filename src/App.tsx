import { ConfigProvider } from "antd";
import zhCN from 'antd/es/locale/zh_CN';
import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { SkinContainer } from './components/SkinContainer';
import { UranusFooter } from './components/UranusFooter';
import UranusRoute from "./route";

const App: FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <SkinContainer />
      <Router>
        <UranusRoute />
      </Router>
      <UranusFooter />
    </ConfigProvider>
  );
};

export default App;
