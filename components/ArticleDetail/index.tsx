import { CopyOutlined, LoadingOutlined, ShareAltOutlined, SyncOutlined } from '@ant-design/icons';
import { Avatar, Breadcrumb, Button, Col, message, Modal, Row, Space, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import copy from 'copy-to-clipboard';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { format } from 'timeago.js';
import { GoodsType, IArticleEntity, IOrderEntity, ITokenEntity, IUserEntity, ShareWith, TokenType } from '../../types';
import { formatDate } from '../../utils';
import { generateOrder, getToken, updateToken } from '../../utils/httpClient';
import { ArticleActionsLazyLoad } from '../ArticleActions';
import { CoverLazyLoad } from '../CoverLazyLoad';
import { Pay } from '../Pay';

// 样式
import styles from './articleDetail.module.css';

interface IArticleDetailProps {
  article: IArticleEntity;
  articleDesc: string;
  articleContent: string;
  user: IUserEntity;
  refresh: () => Promise<void>;
}

const actionItemsStyle = { paddingTop: 10, borderTop: '1px solid #f2f2f5' };

export const ArticleDetail: FC<IArticleDetailProps> = (props) => {
  const router = useRouter();

  const [orderLoading, setOrderLoading] = useState(false);
  const [payState, setPayState] = useState<{ visible: boolean, order: IOrderEntity | null }>({ visible: false, order: null });
  const [shareState, setShareState] = useState<{ loading: boolean, visible: boolean, data: ITokenEntity | null }>({ loading: false, visible: false, data: null });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const onShareClick = useCallback(async () => {
    setShareState({ loading: true, visible: false, data: null });
    try {
      const result = await getToken({ tokenType: TokenType.article, targetId: props.article.id! });
      setShareState({ loading: false, visible: true, data: result.data.data });
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message,
      });
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
      Modal.error({
        title: '错误',
        content: ex.message,
      });
      setShareState({ loading: false, visible: true, data: null });
    }
  }, [shareState, props.article.id]);

  const onTokenCopy = useCallback(() => {
    if (typeof window !== 'undefined') {
      const { protocol, host } = window.location;
      copy(`${protocol}//${host}/article/detail/${props.article.id}?token=${shareState.data!.id}`);
      message.success('已经成功复制到剪切板');
    }
  }, [shareState, props.article.id]);

  const onGenOrderClick = useCallback(async () => {
    try {
      setOrderLoading(true);

      const orderResult = await generateOrder({ goodsType: GoodsType.article, goodsId: props.article.id as string });

      setOrderLoading(false);
      setPayState({ visible: true, order: orderResult.data.data });
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message,
      });
      setOrderLoading(false);
    }
  }, [props.article.id]);

  const onGenOrderCancle = useCallback(() => {
    setPayState({ visible: false, order: null });
  }, []);

  const onPaySuccess = useCallback(async () => {
    await props.refresh();
    setPayState({ visible: false, order: null });
    // eslint-disable-next-line
  }, [props.refresh]);

  return (
    <div className={styles.detail}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={goBack}>博客</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {props.article?.title}
        </Breadcrumb.Item>
      </Breadcrumb>
      <h2 className={styles.title}>
        {props.article?.title}
      </h2>
      <div className={styles.sub_title}>
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
            <div className={styles.buying_guide}>
              <div className={styles.buying_inner}>
                <div className={styles.title}>
                  <b>此文章为付费内容</b>
                </div>
                <div className={styles.desc}>
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
      {
        payState.order &&
        (
          <Pay
            title={props.article.title as string}
            visible={payState.visible}
            order={payState.order}
            onSuccess={onPaySuccess}
            onCancel={onGenOrderCancle}
          />
        )
      }
      <Modal
        visible={shareState.visible}
        title="生成私享链接"
        footer={null}
        onCancel={onShareCancel}
      >
        <div>
          <Row className="uranus-row" style={{ rowGap: 0 }}>
            <Col span={6}>
              分享链接：
            </Col>
            <Col span={18}>
              {
                shareState.data &&
                (
                  <>
                    <span className="uranus-margin-right-8">{`/article/detail/${props.article.id}?token=${shareState.data.id}`}</span>
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
          <Row className="uranus-row" style={{ rowGap: 0 }}>
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