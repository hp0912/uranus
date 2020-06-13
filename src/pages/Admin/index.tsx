import {
  CommentOutlined,
  FileProtectOutlined,
  MessageOutlined,
  TagOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Result } from 'antd';
import { ClickParam } from "antd/lib/menu";
import React, { FC, useCallback, useContext, useState } from 'react';
import { Route, Switch, useHistory, useLocation, useRouteMatch } from "react-router-dom";
import UserAvatar from '../../components/Header/UserAvatar';
import { UserContext } from '../../store/user';
import { AdminArticleAdd } from './AdminArticleAdd';
import { AdminArticleList } from './AdminArticleList';
import { TagManagement } from './TagManagement';

// 样式
import './admin.css';

const { Content, Sider, Header } = Layout;

export enum AdminMenuKey {
  article_management = 'article_management',
  tag_management = 'tag_management',
  comment_management = 'comment_management',
  message_management = 'message_management',
  user_management = 'user_management',
}

const Admin: FC = (props) => {
  const history = useHistory();
  const match = useRouteMatch();
  const loc = useLocation();
  const userContext = useContext(UserContext);

  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);

  const onSiderCollapse = useCallback((collapsed: boolean) => {
    setSiderCollapsed(collapsed);
  }, []);

  const goHome = useCallback(() => {
    history.push('/');
  }, [history]);

  const onMenuClick = useCallback((param: ClickParam) => {
    if (param.key === AdminMenuKey.article_management) {
      history.push(`/admin`);
    } else {
      history.push(`/admin/${param.key}`);
    }
  }, [history]);

  const selectedKeysMatch = loc.pathname.match(/^\/admin\/([^/]+?)(?:\/|\?|$)/);
  const selectedKeys: string[] = [];

  if (selectedKeysMatch && selectedKeysMatch[1]) {
    if (selectedKeysMatch[1] === 'articleAdd') {
      selectedKeys.push(AdminMenuKey.article_management);
    } else {
      selectedKeys.push(selectedKeysMatch[1]);
    }
  } else {
    selectedKeys.push(AdminMenuKey.article_management);
  }

  if (!userContext.userState || userContext.userState.accessLevel < 6) {
    return (
      <Result
        status="403"
        className="uranus-403"
        title="403"
        subTitle="亲, 您没有权限访问此页面呢..."
        extra={<Button type="primary" href="/">返回首页</Button>}
      />
    );
  }

  return (
    <Layout className="uranus-layout">
      <Sider collapsible collapsed={siderCollapsed} onCollapse={onSiderCollapse}>
        <div className="uranus-admin-logo" onClick={goHome} />
        <Menu theme="dark" defaultSelectedKeys={selectedKeys} mode="inline" onClick={onMenuClick}>
          <Menu.Item key={AdminMenuKey.article_management} icon={<FileProtectOutlined />}>
            文章管理
          </Menu.Item>
          <Menu.Item key={AdminMenuKey.tag_management} icon={<TagOutlined />}>
            标签管理
          </Menu.Item>
          <Menu.Item key={AdminMenuKey.comment_management} icon={<CommentOutlined />}>
            评论管理
          </Menu.Item>
          <Menu.Item key={AdminMenuKey.message_management} icon={<MessageOutlined />}>
            留言管理
          </Menu.Item>
          <Menu.Item key={AdminMenuKey.user_management} icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="uranus-admin-header">
          <UserAvatar isBackend={true} avatarColor="#000" avatarSize={38} />
        </Header>
        <Content className="uranus-admin-content">
          <Switch>
            <Route path={match.path} exact component={AdminArticleList} />
            <Route path={`${match.path}/articleAdd`} exact component={AdminArticleAdd} />
            <Route path={`${match.path}/${AdminMenuKey.tag_management}`} exact component={TagManagement} />
          </Switch>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
