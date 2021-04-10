import React from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { PageLoading } from '../../../components/PageLoading';

const ArticleEditWithNoSSR = dynamic(() => import('../../../components/ArticleEdit'), {
  ssr: false,
  loading: ({ isLoading }) => {
    if (isLoading) {
      return <PageLoading />;
    }
    return null;
  },
});

const AdminArticleEdit = () => <ArticleEditWithNoSSR />;

export default AdminArticleEdit;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
      isAdmin: true,
    }
  };
};