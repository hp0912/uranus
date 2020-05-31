import { Avatar, Breadcrumb, Space } from "antd";
import React, { FC, useCallback } from "react";
import { RouteComponentProps, useHistory, withRouter } from "react-router";
import { format } from "timeago.js";

import 'react-markdown-editor-lite/lib/index.css';
import "../components.css";
import "./articleDetail.css";

const avatar = require("../../assets/images/avatar.jpg");

interface IArticleDetailProps {
  html: string;
}

type IProps = RouteComponentProps<any> & IArticleDetailProps;

const ArticleDetailInner: FC<IProps> = (props) => {

  const history = useHistory();

  const goBack = useCallback(() => {
    history.push('/articlelist');
  }, [history]);

  return (
    <div className="uranus-article-detail">
      <Breadcrumb>
        <Breadcrumb.Item>
          <span style={{ color: "#1890ff", cursor: "pointer" }} onClick={goBack}>博客</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          霸道总裁
        </Breadcrumb.Item>
      </Breadcrumb>
      <h2 className="uranus-title">
        霸道总裁之总裁夫人手撕小三
      </h2>
      <div className="uranus-sub-title">
        <Space size="small">
          <Avatar size={30} src={avatar} />
          <span>最后的轻语</span>
          发表于
          {
            format(1588421050276, 'zh_CN')
          }
        </Space>
      </div>
      <div className="uranus-article-image-container">
        <div className="uranus-article-image-sub">
          <div className="uranus-article-image" />
        </div>
      </div>
      <p>
      【CSS布局奇技淫巧：各种居中】居中是我们使用css来布局时常遇到的情况。使用css来进行居中时，有时一个属性就能搞定，有时则需要一定的技巧才能兼容到所有浏览器，本文就居中的一些常用方法做个简单的介绍。
      【川大玻璃杯事件，一个玻璃杯引发的年度大戏】这几天被川大的“玻璃杯事件”刷屏啦！一个四川大学的妹子为了撩帅哥哥，故意打碎对方的玻璃杯，事后发现杯子超贵就发帖吐槽，结果男生也看到帖子……好了，现在马上出门买玻璃杯！
      </p>
      <div className="custom-html-style">
        <div dangerouslySetInnerHTML={{ __html: props.html }} />
      </div>
    </div>
  );
};

export const ArticleDetail = withRouter(ArticleDetailInner);