import React, { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { SkinContainer } from './components/SkinContainer';
import { UranusFooter } from './components/UranusFooter';
import UranusRoute from "./route";

const App: FC = () => {
  return (
    <>
      <SkinContainer />
      <Router>
        <UranusRoute />
      </Router>
      <UranusFooter />
    </>
  );
};

export default App;
