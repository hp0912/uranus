import React from "react";
import dynamic from 'next/dynamic';
import { PageLoading } from "../components/PageLoading";

const MessageBoardWithNoSSR = dynamic(() => import('../components/MessageBoard'), {
  ssr: false,
  loading: ({ isLoading }) => {
    if (isLoading) {
      return <PageLoading />;
    }
    return null;
  },
});

const MessageBoard = () => <MessageBoardWithNoSSR />;

export default MessageBoard;
