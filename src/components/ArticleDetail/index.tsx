import { CopyOutlined, LoadingOutlined, ShareAltOutlined, SyncOutlined } from "@ant-design/icons";
import { Avatar, Breadcrumb, Button, Col, message, Modal, Row, Space, Tooltip } from "antd";
import copy from 'copy-to-clipboard';
import React, { FC, useCallback, useEffect, useState } from "react";
import { RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { format } from "timeago.js";
import { GoodsType, IArticleEntity, IOrderEntity, ITokenEntity, IUserEntity, ShareWith, TokenType } from "../../types";
import { formatDate } from "../../utils";
import { generateOrder, getToken, updateToken } from "../../utils/httpClient";
import { ArticleActionsLazyLoad } from "../ArticleActions";
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

const actionItemsStyle = { paddingTop: 10, borderTop: '1px solid #f2f2f5' };

const ArticleDetailInner: FC<IProps> = (props) => {
  const history = useHistory();

  const [orderLoading, setOrderLoading] = useState(false);
  const [payState, setPayState] = useState<{ visible: boolean, order: IOrderEntity | null }>({ visible: false, order: null });
  const [shareState, setShareState] = useState<{ loading: boolean, visible: boolean, data: ITokenEntity | null }>({ loading: false, visible: false, data: null });

  const { host, protocol } = window.location;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const onShareClick = useCallback(async () => {
    setShareState({ loading: true, visible: false, data: null });
    try {
      const result = await getToken({ tokenType: TokenType.article, targetId: props.article.id! });
      setShareState({ loading: false, visible: true, data: result.data.data });
    } catch (ex) {
      message.error(ex.message);
      setShareState({ loading: false, visible: false, data: null });
    }
  }, [props.article.id]);

  const onShareCancel = useCallback(() => {
    setShareState({ loading: false, visible: false, data: null });
  }, []);

  const onTokenUpdate = useCallback(async () => {
    setShareState({ loading: true, visible: true, data: shareState.data });
    try {
      const result = await updateToken({ tokenType: TokenType.article, targetId: props.article.id! });
      setShareState({ loading: false, visible: true, data: result.data.data });
    } catch (ex) {
      message.error(ex.message);
      setShareState({ loading: false, visible: true, data: null });
    }
  }, [shareState, props.article.id]);

  const onTokenCopy = useCallback(() => {
    copy(`${protocol}//${host}/article/detail/${props.article.id}?token=${shareState.data!.id}`);
    message.success('已经成功复制到剪切板');
  }, [shareState, props.article.id, protocol, host]);

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
          {
            props.article.shareWith === ShareWith.private &&
            (
              <Tooltip title="生成私享链接">
                {
                  shareState.loading ?
                    <LoadingOutlined /> :
                    <ShareAltOutlined onClick={onShareClick} />
                }
              </Tooltip>
            )
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
              <ArticleActionsLazyLoad article={props.article} autoExpand actionItemsStyle={actionItemsStyle} />
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
      <Modal
        visible={shareState.visible}
        title="生成私享链接"
        footer={null}
        onCancel={onShareCancel}
      >
        <div>
          <Row className="uranus-row">
            <Col span={6}>
              分享链接：
            </Col>
            <Col span={18}>
              {
                shareState.data &&
                (
                  <>
                    <span className="uranus-margin-right-8">{`${protocol}//${host}/article/detail/${props.article.id}?token=${shareState.data.id}`}</span>
                    <Tooltip title="复制链接">
                      <CopyOutlined className="uranus-margin-right-8" onClick={onTokenCopy} />
                    </Tooltip>
                    {
                      shareState.loading ?
                        <LoadingOutlined /> :
                        (
                          <Tooltip title="刷新链接">
                            <SyncOutlined onClick={onTokenUpdate} />
                          </Tooltip>
                        )
                    }
                  </>
                )
              }
            </Col>
          </Row>
          <Row className="uranus-row">
            <Col span={6}>
              链接到期时间：
            </Col>
            <Col span={18}>
              {
                shareState.data &&
                <span>{formatDate(shareState.data.expires!)}</span>
              }
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export const ArticleDetail = withRouter(ArticleDetailInner);