import React from 'react';
import './App.css';
import { Content } from "./components/Content";
import { Header } from "./components/Header";
import { SkinContainer } from "./components/SkinContainer";

function App() {
  return (
    <div>
      <SkinContainer />
      <Header />
      <Content
        left={<span>1</span>}
        right={<span>2</span>}
      >
        3
      </Content>
    </div>
  );
}

export default App;
