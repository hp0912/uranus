import { Avatar, Breadcrumb, Button, message, Space } from "antd";
import React, { FC, useCallback, useState } from "react";
import { RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { format } from "timeago.js";
import { GoodsType, IArticleEntity, IOrderEntity, IUserEntity } from "../../types";
import { generateOrder } from "../../utils/httpClient";
import { CoverLazyLoad } from "../CoverLazyLoad";
import { Pay } from '../Pay';
import { CommentEditor } from "../UranusComment/CommentEditor";

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
  const [payState, setPayState] = useState<{ visible: boolean, order: IOrderEntity | null }>({ visible: false, order: null });

  const goBack = useCallback(() => {
    history.push('/articles');
  }, [history]);

  const onGenOrderClick = useCallback(async () => {
    try {
      setOrderLoading(true);

      const orderResult = await generateOrder({ goodsType: GoodsType.article, goodsId: props.article.id as string });

      setOrderLoading(false);
      setPayState({ visible: true, order: orderResult.data.data });
    } catch (ex) {
      message.error(ex.message);
      setOrderLoading(false);
    }
  }, [props.article.id]);

  const onGenOrderCancle = useCallback(() => {
    setPayState({ visible: false, order: null });
  }, []);

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
          (
            <div>
              <div className="custom-html-style" dangerouslySetInnerHTML={{ __html: props.articleContent }} />
              <CommentEditor
                onSubmit={() => {
                  return new Promise((resolve, reject) => {
                    setTimeout(() => {
                      resolve();
                    }, 2000);
                  });
                }}
                user={{ username: '', nickname: '', accessLevel: 0, avatar: 'https://img.houhoukang.com/uranus/user/5edcb630c1ae904d73a5d0af/avatar_1592139038627.jpg' }}
              />
            </div>
          ) :
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
        order={payState.order}
        onCancel={onGenOrderCancle}
      />
    </div>
  );
};

export const ArticleDetail = withRouter(ArticleDetailInner);