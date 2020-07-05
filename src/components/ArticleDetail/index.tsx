import { Avatar, Breadcrumb, Button, message, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { format } from "timeago.js";
import { GoodsType, IArticleEntity, IUserEntity } from "../../types";
import { generateOrder } from "../../utils/httpClient";
import { CoverLazyLoad } from "../CoverLazyLoad";
import { Pay } from '../Pay';

// 样式
import "../components.css";
import "./articleDetail.css";

interface IArticleDetailProps {
  article: IArticleEntity;
  articleDesc: string;
  articleContent: string;
  user: IUserEntity;
}

type IProps = RouteComponentProps & IArticleDetailProps;

const ArticleDetailInner: FC<IProps> = (props) => {
  const history = useHistory();

  const [orderLoading, setOrderLoading] = useState(false);
  const [payState, setPayState] = useState({ visible: false });

  const goBack = useCallback(() => {
    history.push('/articles');
  }, [history]);

  const onGenOrderClick = useCallback(async () => {
    try {
      setOrderLoading(true);

      await generateOrder({ goodsType: GoodsType.article, goodsId: props.article.id as string });

      setOrderLoading(false);
      setPayState({ visible: true });
    } catch (ex) {
      message.error(ex.message);
      setOrderLoading(false);
    }
  }, [props.article.id]);

  return (
    <div className="uranus-article-detail">
      <Breadcrumb>
        <Breadcrumb.Item>
          <span style={{ color: "#1890ff", cursor: "pointer" }} onClick={goBack}>博客</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {props.article?.title}
        </Breadcrumb.Item>
      </Breadcrumb>
      <h2 className="uranus-title">
        {props.article?.title}
      </h2>
      <div className="uranus-sub-title">
        <Space size="small">
          <Avatar size={30} src={props.user?.avatar} />
          <span>{props.user?.nickname} </span>
          发表于
          {
            format(props.article?.createdTime as number, 'zh_CN')
          }
        </Space>
      </div>
      <CoverLazyLoad coverURL={props.article?.coverPicture as string} />
      {
        props.articleDesc &&
        <div className="custom-html-style" dangerouslySetInnerHTML={{ __html: props.articleDesc }} />
      }
      {
        props.articleContent ?
          <div className="custom-html-style" dangerouslySetInnerHTML={{ __html: props.articleContent }} /> :
          (
            <div className="uranus-buying-guide">
              <div className="uranus-buying-inner">
                <div className="title">
                  <b>此文章为付费内容</b>
                </div>
                <div className="desc">
                  现在购买立即解锁全部内容
                </div>
                <Button
                  type="primary"
                  onClick={onGenOrderClick}
                  loading={orderLoading}
                >
                  立即购买 ¥ {props.article.amount}
                </Button>
              </div>
            </div>
          )
      }
      <Pay
        title={props.article.title as string}
        visible={payState.visible}
        onCancel={() => { return; }}
      />
    </div>
  );
};

export const ArticleDetail = withRouter(ArticleDetailInner);