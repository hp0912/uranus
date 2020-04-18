import { HomeOutlined, IdcardOutlined, MessageOutlined } from "@ant-design/icons";
import { Col, Input, Menu, Row } from "antd";
import React, { FC } from "react";
import styled from "styled-components";
import "./header.css";

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

const UranusHeaderLogo = styled.div`
  height: 30px;
  text-align: center;
  margin: 8px 0;
  padding: 2px 2px 2px 8px;
  float: left;
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

const Header: FC = (props) => {
  return (
    <UranusHeader>
      <Row>
        <Col xs={0} md={3} />
        <Col xs={24} md={12}>
          <UranusHeaderLogo>
            <img 
              src={require("../../assets/images/dog.png")} 
              alt="logo" 
              className="uranus-header-logo-image"
            />
            <b className="uranus-header-logo-text">吼吼</b>
          </UranusHeaderLogo>
          <Menu theme="light" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <HomeOutlined />首页
            </Menu.Item>
            <Menu.Item key="2">
              <MessageOutlined />留言板
            </Menu.Item>
            <Menu.Item key="3">
              <IdcardOutlined />关于我
            </Menu.Item>
          </Menu>
        </Col>
        <Col xs={18} md={3}>
          <UranusHeaderSearch>
            <Search
              placeholder="请输入关键字..."
              onSearch={value => console.log(value)}
              className="uranus-header-search"
            />
          </UranusHeaderSearch>
        </Col>
        <Col xs={6} md={3}>
          <div className="uranus-header-login-container">
            <span className="uranus-header-login">登录·</span>
            <span className="uranus-header-register">注册</span>
          </div>
        </Col>
        <Col xs={0} md={3} />
      </Row>
    </UranusHeader>
  );
};

export default Header;
