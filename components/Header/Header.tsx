import { HomeOutlined, IdcardOutlined, InstagramOutlined, MessageOutlined } from '@ant-design/icons';
import { Col, Input, Menu, Row } from 'antd';
import React, { FC, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { UserContext } from '../../store/user';
import { Auth } from '../Auth';
import { AuthMode } from '../Auth/SignUp';
import UserAvatar from './UserAvatar';

// 样式
import styles from './header.module.css';

const { Search } = Input;

export enum MenuKey {
  frontend = 'frontend',
  gossip = 'gossip',
  messageboard = 'messageboard',
  aboutus = 'aboutus',
}

const Header: FC = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);

  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthMode>(AuthMode.none);

  const onSearch = useCallback((value: string) => {
    if (value) {
      router.push(`/${MenuKey.frontend}?keyword=${value}`);
    } else {
      router.push(`/${MenuKey.frontend}`);
    }
  }, [router]);

  const onSignInClick = useCallback(() => {
    setAuthState(AuthMode.signin);
    setAuthVisible(true);
  }, []);

  const onSignUpClick = useCallback(() => {
    setAuthState(AuthMode.signup);
    setAuthVisible(true);
  }, []);

  const onAuthCancel = useCallback(() => {
    setAuthState(AuthMode.none);
    setAuthVisible(false);
  }, []);

  const selectedKeysMatch = router.pathname.match(/^\/([^/]+?)(?:\/|\?|$)/);
  const selectedKeys = selectedKeysMatch && selectedKeysMatch[1] ? [selectedKeysMatch[1]] : [];

  return (
    <div className={styles.uranus_header}>
      <Row style={{ rowGap: 0 }}>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={3} />
        <Col xs={18} sm={18} md={18} lg={14} xl={12} xxl={12}>
          <div className={styles.uranus_menu_container}>
            <div className={styles.uranus_menu_container_left}>
              <div className={styles.uranus_header_logo}>
                <Link href="/">
                  <a>
                    <div className={styles.uranus_header_image} />
                  </a>
                </Link>
              </div>
            </div>
            <div className={styles.uranus_menu_container_right}>
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={selectedKeys}
              >
                <Menu.Item key={MenuKey.frontend} icon={<HomeOutlined />}>
                  <Link href="/frontend">
                    <a>
                      前端优选
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item key={MenuKey.gossip} icon={<InstagramOutlined />}>
                  <Link href="/gossip">
                    <a>
                      神秘空间
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item className={styles.uranus_menu_item_hide} key={MenuKey.messageboard} icon={<MessageOutlined />}>
                  <Link href="/messageboard">
                    <a>
                      留言板
                    </a>
                  </Link>
                </Menu.Item>
                <Menu.Item className={styles.uranus_menu_item_hide} key={MenuKey.aboutus} icon={<IdcardOutlined />}>
                  <Link href="/aboutus">
                    <a>
                      关于我
                    </a>
                  </Link>
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={5} xl={4} xxl={3}>
          <div className={styles.uranus_header_search}>
            <Search
              placeholder="请输入关键字..."
              onSearch={onSearch}
              className="uranus-width-100"
            />
          </div>
        </Col>
        <Col xs={6} sm={6} md={6} lg={5} xl={4} xxl={4}>
          <div className={styles.uranus_header_login_container}>
            {
              userContext.userState ?
                <UserAvatar isBackend={false} avatarColor="#fff" avatarSize={30} /> :
                (
                  <>
                    <span className={styles.uranus_header_login} onClick={onSignInClick}>登录·</span>
                    <span className={styles.uranus_header_register} onClick={onSignUpClick}>注册</span>
                  </>
                )
            }
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2} />
      </Row>
      <Auth mode={authState} visible={authVisible} onCancel={onAuthCancel} />
    </div>
  );
};

export default Header;
