import React, { FC } from 'react';
import { Advertisement01 } from '../../components/Advertisement/Advertisement01';
import { Advertisement02 } from '../../components/Advertisement/Advertisement02';
import { ArticleList } from '../../components/ArticleList';
import { Content } from "../../components/Content";
import { Header } from '../../components/Header';
import { MagicBox } from '../../components/MagicBox';
import { UranusAvatar } from '../../components/UranusAvatar';
import { UranusMotto } from '../../components/UranusMotto';
import { ArticleCategory } from '../../types';

export const GossipPage: FC = (props) => {
  return (
    <>
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
            <MagicBox />
            <Advertisement02 />
          </>
        )}
      >
        <ArticleList category={ArticleCategory.gossip} />
      </Content>
    </>
  );
};
