import { DollarCircleOutlined, TwitterOutlined } from '@ant-design/icons';
import { Breadcrumb, Empty, Result, Tabs } from 'antd';
import React, { FC, useContext } from 'react';
import { UserContext } from '../../store/user';
import { MyBlog } from './MyBlog';

// 样式
import './user.css';

const { TabPane } = Tabs;

export const CUserHomePages: FC = (props) => {
  const userContext = useContext(UserContext);

  if (!userContext.userState) {
    return (
      <Result
        status="403"
        className="uranus-403"
        title="403"
        subTitle="亲, 登录信息已过期..."
      />
    );
  }

  return (
    <div className="uranus-user-homepages">
      <Breadcrumb>
        <Breadcrumb.Item>
          <span>用户中心</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          我的主页
        </Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Tabs defaultActiveKey="my-blog">
          <TabPane
            tab={
              (
                <span>
                  <TwitterOutlined />
                  我的博客
                </span>
              )
            }
            key="my-blog"
          >
            <MyBlog />
          </TabPane>
          <TabPane
            tab={
              (
                <span>
                  <DollarCircleOutlined />
                  我的应收账款
                </span>
              )
            }
            key="my-receivables"
          >
            <Empty />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};