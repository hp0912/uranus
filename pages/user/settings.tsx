import React, { FC } from 'react';
import { Advertisement01 } from '../../components/Advertisement/Advertisement01';
import { Advertisement02 } from '../../components/Advertisement/Advertisement02';
import { Content } from "../../components/Content";
import { Header } from '../../components/Header';
import { UranusAvatar } from '../../components/UranusAvatar';
import { UranusMotto } from '../../components/UranusMotto';
import { CUserSettings } from '../../components/User/Settings';

const UserSettings = (props: FC) => {
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
        <CUserSettings />
      </Content>
    </>
  );
};

export default UserSettings;

export async function getStaticProps() {
  return {
    props: {
      userState: null,
    }
  };
}