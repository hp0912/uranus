import React from 'react';
import './App.css';
import { Advertisement01 } from './components/Advertisement/Advertisement01';
import { ArticleList } from './components/ArticleList';
import { Content } from "./components/Content";
import { Header } from "./components/Header";
import { SkinContainer } from "./components/SkinContainer";
import { UranusAvatar } from './components/UranusAvatar';

function App() {
  return (
    <div>
      <SkinContainer />
      <Header />
      <Content
        left={(
          <>
            <UranusAvatar />
            <Advertisement01 />
          </>
        )}
        right={<span>2</span>}
      >
        <ArticleList />
      </Content>
    </div>
  );
}

export default App;
