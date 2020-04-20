import React from 'react';
import './App.css';
import { Advertisement01 } from './components/Advertisement/Advertisement01';
import { Advertisement02 } from './components/Advertisement/Advertisement02';
import { ArticleList } from './components/ArticleList';
import { Content } from "./components/Content";
import { Header } from "./components/Header";
import { SkinContainer } from "./components/SkinContainer";
import { UranusAvatar } from './components/UranusAvatar';
import { UranusFooter } from './components/UranusFooter';
import { UranusMotto } from './components/UranusMotto';
import { UranusPlayer } from './components/UranusPlayer';

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
        right={(
          <>
            <UranusMotto />
            <UranusPlayer />
            <Advertisement02 />
          </>
        )}
      >
        <ArticleList />
      </Content>
      <UranusFooter />
    </div>
  );
}

export default App;
