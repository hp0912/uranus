import React from 'react';
import dynamic from 'next/dynamic';
import { PageLoading } from '../../components/PageLoading';
import { GetServerSideProps } from 'next';

const WebsiteManagementWithNoSSR = dynamic(() => import('../../components/Admin/website_management'), {
  ssr: false,
  loading: ({ isLoading }) => {
    if (isLoading) {
      return <PageLoading />;
    }
    return null;
  },
});

const AdminWebsiteManagement = () => <WebsiteManagementWithNoSSR />;

export default AdminWebsiteManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
      isAdmin: true,
    }
  };
};