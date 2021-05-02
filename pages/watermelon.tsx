import React from 'react';
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
);

export default Watermelon;