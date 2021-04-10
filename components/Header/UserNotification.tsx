import { Tabs } from 'antd';
import React, { FC } from 'react';
import { notificationAll, notificationList } from '../../utils/httpClient';
import { NotificationList } from './NotificationList';

const { TabPane } = Tabs;

export const UserNotification: FC = () => {
  return (
    <div className="user-notification">
      <Tabs type="card">
        <TabPane tab="未读消息" key="hasnotread">
          <NotificationList
            type="hasnotread"
            getData={notificationList}
          />
        </TabPane>
        <TabPane tab="全部消息" key="all">
          <NotificationList
            type="all"
            getData={notificationAll}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
