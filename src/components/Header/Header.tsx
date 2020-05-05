import { HomeOutlined, IdcardOutlined, MessageOutlined } from "@ant-design/icons";
import { Col, Input, Menu, Row } from "antd";
import { ClickParam } from "antd/lib/menu";
import React, { FC, useCallback, useState } from "react";
import { useHistory, useRouteMatch, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Auth, AuthMode } from "../Auth";
import "./header.css";

const { Search } = Input;

const logo = require("../../assets/images/logo-houhou.png");

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

const UranusHeaderLogo = styled.div`
  height: 46px;
  text-align: center;
  padding: 0 2px 0 8px;
  float: left;
`;

const UranusHeaderImage = styled.div`
  width: 80px;
  height: 46px;
  background-image: url(${logo});
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: cover;
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
  articlelist = 'articlelist',
  messageboard = 'messageboard',
  aboutus = 'aboutus',
}

const Header: FC = (props) => {
  
  const history = useHistory();
  const routerMatch = useRouteMatch();

  const [authVisible, setAuthVisible] = useState<boolean>(false);

  const onMenuClick = useCallback((param: ClickParam) => {
    history.push(`/${param.key}`);
  }, [history]);

  const onSearch = useCallback((value: string) => {
    if (value) {
      history.push(`/${MenuKey.articlelist}?keyword=${value}`);
    } else {
      history.push(`/${MenuKey.articlelist}`);
    }
  }, [history]);

  const onSignInClick = useCallback(() => {
    setAuthVisible(true);
  }, []);

  const onAuthCancel = useCallback(() => {
    setAuthVisible(false);
  }, []);

  const selectedKeysMatch = routerMatch.path.match(/^\/([^/]+?)(?:\/|\?|$)/);
  const selectedKeys = selectedKeysMatch && selectedKeysMatch[1] ? [selectedKeysMatch[1]] : [];

  return (
    <UranusHeader>
      <Row>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={3}/>
        <Col xs={24} sm={24} md={24} lg={14} xl={12} xxl={12}>
          <div className="uranus-menu-container">
            <div className="uranus-menu-container-left">
              <UranusHeaderLogo>
                <Link to="/">
                  <UranusHeaderImage />
                </Link>
              </UranusHeaderLogo>
            </div>
            <div className="uranus-menu-container-right">
              <Menu 
                theme="light" 
                mode="horizontal" 
                defaultSelectedKeys={selectedKeys}
                onClick={onMenuClick}
              >
                <Menu.Item key={MenuKey.articlelist} icon={<HomeOutlined />}>
                  博客
                </Menu.Item>
                <Menu.Item key={MenuKey.messageboard} icon={<MessageOutlined />}>
                  留言板
                </Menu.Item>
                <Menu.Item key={MenuKey.aboutus} icon={<IdcardOutlined />}>
                  关于我
                </Menu.Item>
              </Menu>
            </div>
          </div>
        </Col>
        <Col xs={18} sm={18} md={18} lg={5} xl={4} xxl={3}>
          <UranusHeaderSearch>
            <Search
              placeholder="请输入关键字..."
              onSearch={onSearch}
              className="uranus-header-search"
            />
          </UranusHeaderSearch>
        </Col>
        <Col xs={6} sm={6} md={6} lg={5} xl={4} xxl={4}>
          <div className="uranus-header-login-container">
            <span className="uranus-header-login" onClick={onSignInClick}>登录·</span>
            <span className="uranus-header-register">注册</span>
          </div>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xl={2} xxl={2} />
      </Row>
      <Auth mode={AuthMode.signup} visible={authVisible} onCancel={onAuthCancel} />
    </UranusHeader>
  );
};

export default withRouter(Header);
