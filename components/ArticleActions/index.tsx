import { EyeOutlined, LikeFilled, LikeOutlined, LoadingOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Divider, message, Modal } from "antd";
import React, { CSSProperties, FC, useCallback, useContext, useEffect, useState } from "react";
import LazyLoad from 'react-lazyload';
import { UserContext } from "../../store/user";
import { CommentType, IArticleEntity, ICommentEntity, IUranusNode, LikesType } from "../../types";
import { useSetState } from "../../utils/commonHooks";
import { articleActionDataGet, commentDelete, commentSubmit, likesCancel, likesSubmit } from "../../utils/httpClient";
import { UranusComment } from "../UranusComment";

// 样式
import styles from "./articleActions.module.css";

interface IArticleActionsProps {
  article: IArticleEntity;
  actionItemsStyle?: CSSProperties;
  autoExpand?: boolean;
}

interface IActionDataState {
  viewCount: number;
  commentCount: number;
  likesCount: number;
  likesLoading: boolean;
  liked: boolean;
}

export const ArticleActions: FC<IArticleActionsProps> = (props) => {
  const userContext = useContext(UserContext);

  const [commentVisible, setCommentVisible] = useState(props.autoExpand ? true : false);
  const [actionData, setActionData] = useSetState<IActionDataState>({
    viewCount: 0,
    commentCount: 0,
    likesCount: 0,
    likesLoading: false,
    liked: false,
  });

  useEffect(() => {
    articleActionDataGet(props.article.id!).then(result => {
      const { viewCount, commentCount, likesCount, liked } = result.data.data;
      setActionData({ viewCount, commentCount, likesCount, liked });
    }).catch(reason => {
      message.error(reason.message);
    });
    // eslint-disable-next-line
  }, [props.article.id, userContext.userState]);

  const onCommentSubmit = useCallback(async (parentId: string, comment: { rows: IUranusNode[][] }): Promise<ICommentEntity> => {
    const { id } = props.article;

    const result = await commentSubmit({
      commentType: CommentType.article,
      targetId: id!,
      parentId,
      content: comment,
    });

    return result.data.data;
  }, [props.article]);

  const onCommentDelete = useCallback(async (commentId: string): Promise<void> => {
    await commentDelete({ commentId });
  }, []);

  const onStartClick = useCallback(() => {
    Modal.warn({
      title: '敬请期待',
      content: '该功能暂未开放',
    });
  }, []);

  const onLikeClick = useCallback(async () => {
    try {
      setActionData({ likesLoading: true });

      if (actionData.liked) {
        await likesCancel({ likesType: LikesType.article, targetId: props.article.id! });
      } else {
        await likesSubmit({ likesType: LikesType.article, targetId: props.article.id! });
      }

      const result = await articleActionDataGet(props.article.id!);

      const { viewCount, commentCount, likesCount, liked } = result.data.data;
      setActionData({ viewCount, commentCount, likesCount, liked, likesLoading: false });
    } catch (ex) {
      setActionData({ likesLoading: false });
      Modal.error({
        title: '错误',
        content: ex.message,
      });
    }
    // eslint-disable-next-line
  }, [props.article.id, actionData.liked]);

  const onCommentClick = useCallback(() => {
    setCommentVisible(!commentVisible);
  }, [commentVisible]);

  return (
    <div>
      <div className={styles["uranus-article-actions"]} style={props.actionItemsStyle}>
        <span className={styles["actions-item"]}>
          <EyeOutlined /> {actionData.viewCount > 0 ? actionData.viewCount : null}
        </span>
        <Divider type="vertical" />
        <span className={styles["actions-item"]} onClick={onStartClick}>
          <StarOutlined /> 1
        </span>
        <Divider type="vertical" />
        <span className={styles["actions-item"]} onClick={onLikeClick}>
          {
            actionData.likesLoading ?
              <LoadingOutlined /> :
              actionData.liked ?
                <LikeFilled /> :
                <LikeOutlined />
          }
          {actionData.likesCount > 0 ? actionData.likesCount : null}
        </span>
        <Divider type="vertical" />
        <span className={styles["actions-item"]} onClick={onCommentClick}>
          <MessageOutlined /> {actionData.commentCount > 0 ? actionData.commentCount : null}
        </span>
      </div>
      {
        commentVisible &&
        (
          <UranusComment
            className={styles["uranus-article-comment"]}
            commentType={CommentType.article}
            targetId={props.article.id!}
            parentId="0"
            onSubmit={onCommentSubmit}
            onDelete={onCommentDelete}
            user={userContext.userState}
          />
        )
      }
    </div>
  );
};

export const ArticleActionsLazyLoad: FC<IArticleActionsProps> = (props) => {
  return (
    <LazyLoad height={20} offset={100}>
      <ArticleActions {...props} />
    </LazyLoad>
  );
};