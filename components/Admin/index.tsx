import {
  CommentOutlined,
  FileProtectOutlined,
  GlobalOutlined,
  MessageOutlined,
  TagOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Result } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useContext, useState } from 'react';
import UserAvatar from '../../components/Header/UserAvatar';
import { UserContext } from '../../store/user';

// 样式
import styles from './admin.module.css';

const { Content, Sider, Header } = Layout;

export enum AdminMenuKey {
  article_management = 'article_management',
  tag_management = 'tag_management',
  comment_management = 'comment_management',
  message_management = 'message_management',
  order_management = 'order_management',
  user_management = 'user_management',
  website_management = 'website_management',
}

const AdminContainer: FC = (props) => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);

  const onSiderCollapse = useCallback((collapsed: boolean) => {
    setSiderCollapsed(collapsed);
  }, []);

  const goHome = useCallback(() => {
    router.push('/');
  }, [router]);

  const onMenuClick = useCallback((param: MenuInfo) => {
    router.push(`/admin/${param.key}`);
  }, [router]);

  const selectedKeysMatch = router.pathname.match(/^\/admin\/([^/]+?)(?:\/|\?|$)/);
  const selectedKeys: string[] = [];

  if (selectedKeysMatch && selectedKeysMatch[1]) {
    if (selectedKeysMatch[1] === 'article_edit') {
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
    <Layout className={styles.layout}>
      <Sider collapsible collapsed={siderCollapsed} onCollapse={onSiderCollapse}>
        <div className={styles.logo} onClick={goHome} />
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
          <Menu.Item key={AdminMenuKey.order_management} icon={<TaobaoCircleOutlined />}>
            订单管理
          </Menu.Item>
          <Menu.Item key={AdminMenuKey.user_management} icon={<UserOutlined />}>
            用户管理
          </Menu.Item>
          <Menu.Item key={AdminMenuKey.website_management} icon={<GlobalOutlined />}>
            网站管理
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <UserAvatar isBackend={true} avatarColor="#000" avatarSize={38} />
        </Header>
        <Content className={styles.content}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminContainer;
