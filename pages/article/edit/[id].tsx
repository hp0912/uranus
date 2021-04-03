import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React, { FC } from 'react';
import { Advertisement01 } from '../../../components/Advertisement/Advertisement01';
import { Advertisement02 } from '../../../components/Advertisement/Advertisement02';
import { Content } from '../../../components/Content';
import { Header } from '../../../components/Header';
import { PageLoading } from '../../../components/PageLoading';
import { UranusAvatar } from '../../../components/UranusAvatar';
import { UranusMotto } from '../../../components/UranusMotto';

const ArticleEditWithNoSSR = dynamic(() => import('../../../components/ArticleEdit'), {
  ssr: false,
  loading: ({ isLoading }) => {
    if (isLoading) {
      return <PageLoading />;
    }
    return null;
  },
});

const ArticleEditPage: FC = () => {
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
            <Advertisement02 />
          </>
        )}
      >
        <ArticleEditWithNoSSR breadcrumbClassName="uranus-admin-breadcrumb-frontend" />
      </Content>
    </>
  );
};

export default ArticleEditPage;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
    }
  };
};
