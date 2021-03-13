import React from "react";
import dynamic from 'next/dynamic';

const MessageBoardWithNoSSR = dynamic(() => import('../components/MessageBoard'), {
  ssr: false
});

const MessageBoard = () => <MessageBoardWithNoSSR />;

export default MessageBoard;
