import { GetServerSideProps } from 'next';
import React from 'react';
import Head from 'next/head';
import { Advertisement01 } from '../components/Advertisement/Advertisement01';
import { Advertisement02 } from '../components/Advertisement/Advertisement02';
import { ArticleList, IArticleListProps, IArtListParams, parseQuery } from '../components/ArticleList';
import { Content } from '../components/Content';
import { Header } from '../components/Header';
import { MagicBox } from '../components/MagicBox';
import { UranusAvatar } from '../components/UranusAvatar';
import { UranusMotto } from '../components/UranusMotto';
import { ArticleCategory } from '../types';
import { articleList, userStatus } from '../utils/httpClient';

export default function FrontendPage(props: IArticleListProps): JSX.Element {
  return (
    <>
      <Head>
        <title>吼吼的博客</title>
        <meta name="keywords" content="前端，后端，Nodejs，golang，吼吼" />
        <meta name="description" content="吼吼的个人博客" />
      </Head>
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
        <ArticleList {...props} category={ArticleCategory.frontend} />
      </Content>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req: { headers } } = context;
  const { current, pageSize, searchValue } = parseQuery(context.query);

  const params: IArtListParams = {
    category: ArticleCategory.frontend,
    searchValue: encodeURIComponent(searchValue),
    pagination: {
      current,
      pageSize,
    },
  };

  const [
    { data: { data: userState } },
    { data: { data: { articles, users, tags, total } } },
  ] = await Promise.all([
    userStatus(headers),
    articleList(params, headers),
  ]);

  return {
    props: {
      userState,
      articles,
      tags,
      users,
      total,
      current,
      pageSize,
    }
  };
};
