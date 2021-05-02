import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Advertisement01 } from '../components/Advertisement/Advertisement01';
import { Advertisement02 } from '../components/Advertisement/Advertisement02';
import { Content } from '../components/Content';
import { UranusAvatar } from '../components/UranusAvatar';
import { UranusMotto } from '../components/UranusMotto';
import { PageLoading } from '../components/PageLoading';

const WatermelonWithNoSSR = dynamic(() => import('../components/Watermelon'), {
  ssr: false,
  loading: ({ isLoading }) => {
    if (isLoading) {
      return <PageLoading />;
    }
    return null;
  },
});

const Watermelon = () => (
  <>
    <Head>
      <title>DIY合成大西瓜</title>
      <meta name="keywords" content="DIY合成大西瓜" />
      <meta name="description" property="og:description" content="小游戏" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
    </Head>
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
          <Advertisement02 />
        </>
      )}
    >
      <WatermelonWithNoSSR />
    </Content>
  </>
);

export default Watermelon;