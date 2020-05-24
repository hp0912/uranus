import {
  CommentOutlined,
  FileProtectOutlined,
  MessageOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { FC, useCallback, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import './admin.css';
import { AdminArticleAdd } from './AdminArticleAdd';
import { AdminArticleList } from './AdminArticleList';

const { Content, Sider, Header } = Layout;

const Admin: FC = (props) => {
  const history = useHistory();
  const match = useRouteMatch();
  
  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);

  const onSiderCollapse = useCallback((collapsed: boolean) => {
    setSiderCollapsed(collapsed);
  }, []);

  const goHome = useCallback(() => {
    history.push('/');
  }, [history]);
  
  return (
    <Layout className="uranus-layout">
      <Sider collapsible collapsed={siderCollapsed} onCollapse={onSiderCollapse}>
        <div className="uranus-admin-logo" onClick={goHome} />
        <Menu theme="dark" defaultSelectedKeys={['article_management']} mode="inline">
          <Menu.Item key="article_management" icon={<FileProtectOutlined />}>
            文章管理
          </Menu.Item>
          <Menu.Item key="tag_management" icon={<TagOutlined />}>
            标签管理
          </Menu.Item>
          <Menu.Item key="comment_management" icon={<CommentOutlined />}>
            评论管理
          </Menu.Item>
          <Menu.Item key="message_management" icon={<MessageOutlined />}>
            留言管理
          </Menu.Item>
          <Menu.Item key="user_management" icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="uranus-admin-header" />
        <Content className="uranus-admin-content">
          <Switch>
            <Route path={match.path} exact component={AdminArticleList} />
            <Route path={`${match.path}/articleAdd`} component={AdminArticleAdd} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
