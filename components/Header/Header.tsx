import { HomeOutlined, IdcardOutlined, InstagramOutlined, MessageOutlined } from "@ant-design/icons";
import { Col, Input, Menu, Row } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import React, { FC, useCallback, useContext, useState } from "react";
import { withRouter, useRouter } from 'next/router';
import Link from 'next/link';
import styled from "styled-components";
import { UserContext } from '../../store/user';
import { Auth } from "../Auth";
import { AuthMode } from "../Auth/SignUp";
import UserAvatar from './UserAvatar';

// 样式
import styles from "./header.module.css";

const { Search } = Input;

const UranusHeader = styled.div`
  position: fixed;
  top: 0;
  z-index: 999;
  width: 100%;
  background: 0 0;
  background-image: linear-gradient(rgba(15,25,50,.5) 0,rgba(15,25,50,.5) 100%);
  box-shadow: 0 1px 3px rgba(26,26,26,.1);
  .ant-menu-horizontal {
    border-bottom: none;
  }
  .ant-menu {
    background: 0 0;
    color: #fff;
  }
`;

const UranusHeaderSearch = styled.div`
  height: 30px;
  margin: 8px 0 8px 8px;
  .ant-input-affix-wrapper {
    background: 0 0;
  }
  .ant-input {
    background: 0 0;
  }
`;

export enum MenuKey {
  frontend = 'frontend',
  gossip = 'gossip',
  messageboard = 'messageboard',
  aboutus = 'aboutus',
}

const Header: FC = (props) => {

  const router = useRouter();
  const userContext = useContext(UserContext);

  const [authVisible, setAuthVisible] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthMode>(AuthMode.none);

  const onMenuClick = useCallback((param: MenuInfo) => {
    router.push(`/${param.key}`);
  }, [router]);

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
    <UranusHeader>
      <Row>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={3} />
        <Col xs={18} sm={18} md={18} lg={14} xl={12} xxl={12}>
          <div className={styles.uranusMenuContainer}>
            <div className={styles.uranusMenuContainerLeft}>
              <div className={styles.uranusHeaderLogo}>
                <Link href="/">
                  <div className={styles.uranusHeaderImage} />
                </Link>
              </div>
            </div>
            <div className={styles.uranusMenuContainerRight}>
              <Menu
                theme="light"
                mode="horizontal"
                defaultSelectedKeys={selectedKeys}
                onClick={onMenuClick}
              >
                <Menu.Item key={MenuKey.frontend} icon={<HomeOutlined />}>
                  前端优选
                </Menu.Item>
                <Menu.Item key={MenuKey.gossip} icon={<InstagramOutlined />}>
                  神秘空间
                </Menu.Item>
                <Menu.Item className={styles.uranusMenuItemHide} key={MenuKey.messageboard} icon={<MessageOutlined />}>
                  留言板
                </Menu.Item>
                <Menu.Item className={styles.uranusMenuItemHide} key={MenuKey.aboutus} icon={<IdcardOutlined />}>
                  关于我
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={5} xl={4} xxl={3}>
          <UranusHeaderSearch>
            <Search
              placeholder="请输入关键字..."
              onSearch={onSearch}
              className="uranus-width100"
            />
          </UranusHeaderSearch>
        </Col>
        <Col xs={6} sm={6} md={6} lg={5} xl={4} xxl={4}>
          <div className={styles.uranusHeaderLoginContainer}>
            {
              userContext.userState ?
                <UserAvatar isBackend={false} avatarColor="#fff" avatarSize={30} /> :
                (
                  <>
                    <span className={styles.uranusHeaderLogin} onClick={onSignInClick}>登录·</span>
                    <span className={styles.uranusHeaderRegister} onClick={onSignUpClick}>注册</span>
                  </>
                )
            }
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2} />
      </Row>
      <Auth mode={authState} visible={authVisible} onCancel={onAuthCancel} />
    </UranusHeader>
  );
};

export default withRouter(Header);
