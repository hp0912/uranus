import { DollarCircleOutlined, TaobaoOutlined, TwitterOutlined } from '@ant-design/icons';
import { Breadcrumb, Result, Tabs } from 'antd';
import React, { FC, useContext } from 'react';
import { UserContext } from '../../store/user';
import { myOrders, orderReceivables } from '../../utils/httpClient';
import { MyBlog } from './MyBlog';
import { MyOrders } from './MyOrders';

// 样式
import styles from './user.module.css';

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
    <div className={styles["uranus-user-homepages"]}>
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
            <MyOrders dataSource={orderReceivables} />
          </TabPane>
          <TabPane
            tab={
              (
                <span>
                  <TaobaoOutlined />
                  我的订单
                </span>
              )
            }
            key="my-order"
          >
            <MyOrders dataSource={myOrders} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};