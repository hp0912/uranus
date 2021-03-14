import { GetServerSideProps } from 'next';
import React, { FC } from 'react';
import { Advertisement01 } from '../../../components/Advertisement/Advertisement01';
import { Advertisement02 } from '../../../components/Advertisement/Advertisement02';
// import { ArticleEdit } from '../../../components/ArticleEdit';
import { Content } from "../../../components/Content";
import { Header } from '../../../components/Header';
import { UranusAvatar } from '../../../components/UranusAvatar';
import { UranusMotto } from '../../../components/UranusMotto';

const ArticleEditPage: FC = (props) => {
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
        {/* <ArticleEdit
          breadcrumbClassName="uranus-admin-breadcrumb-frontend"
          baseURL="/article/edit/"
        /> */}
        123
      </Content>
    </>
  );
};

export default ArticleEditPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      userState: null,
    }
  };
}
