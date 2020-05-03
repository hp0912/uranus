// import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { /* Avatar, */ Avatar, List, Tag, Typography } from "antd";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import "./articleList.css";

const avatar = require("../../assets/images/avatar.jpg");
const paragConfig = { rows: 3, expandable: true };

export const ArticleList: FC = (props) => {
  const listData: any[] = [];

  for (let i = 0; i < 23; i++) {
    listData.push({
      href: 'http://ant.design',
      title: `ant design part ${i}`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }

  const utags = ['typescript'];

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        onChange: page => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={listData}
      renderItem={item => (
        <List.Item
          key={item.title}
        >
          <div className="uranus-article-title">
            <div className="user-avatar">
              <Avatar size={50} src={avatar} />
            </div>
            <div className="article-title">
              <div className="article-title-name">
                <Link to="/">
                  MM自动化测试从入门到精通
                </Link>
              </div>
              <div className="article-title-others">
                {
                  utags.map(titem => {
                    return (
                      <Tag color="blue" key={titem}>{titem}</Tag>
                    );
                  })
                }
                <span className="article-title-timeago">
                  {
                    format(1588421050276, 'zh_CN')
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="uranus-article-image-container">
            <div className="uranus-article-image-sub">
              <Link to="/">
                <div className="uranus-article-image" />
              </Link>
            </div>
          </div>
          <Typography.Paragraph ellipsis={paragConfig} className="uranus-article-desc">
            【CSS布局奇技淫巧：各种居中】居中是我们使用css来布局时常遇到的情况。使用css来进行居中时，有时一个属性就能搞定，有时则需要一定的技巧才能兼容到所有浏览器，本文就居中的一些常用方法做个简单的介绍。
            【川大玻璃杯事件，一个玻璃杯引发的年度大戏】这几天被川大的“玻璃杯事件”刷屏啦！一个四川大学的妹子为了撩帅哥哥，故意打碎对方的玻璃杯，事后发现杯子超贵就发帖吐槽，结果男生也看到帖子……好了，现在马上出门买玻璃杯！
          </Typography.Paragraph>
        </List.Item>
      )}
    />
  );
};
