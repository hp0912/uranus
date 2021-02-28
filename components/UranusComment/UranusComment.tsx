import { message, Modal } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { CommentType, ICommentEntity, IUranusNode, IUserEntity } from '../../types';
import { useSafeProps } from '../../utils/commonHooks';
import { commentList } from '../../utils/httpClient';
import { CommentEditor } from './CommentEditor';
import { CommentList } from './CommentList';

// 样式
import './comment.module.css';

interface IUranusCommentProps {
  className?: string;
  commentType: CommentType;
  targetId: string;
  parentId: string;
  user: IUserEntity | null;
  onSubmit: (parentId: string, comment: { rows: IUranusNode[][] }) => Promise<ICommentEntity>;
  onDelete: (commentId: string) => Promise<void>;
}

interface IUranusCommentState {
  initLoading: boolean;
  comments: ICommentEntity[];
}

export const UranusComment: FC<IUranusCommentProps> = (props) => {
  const { className, commentType, targetId, parentId, user } = props;

  const [commentListState, setCommentListState] = useState<IUranusCommentState>({
    initLoading: true,
    comments: [],
  });
  const [replyComment, setReplyComment] = useState<ICommentEntity | null>(null);

  const safeProps = useSafeProps<IUranusCommentProps>(props);

  useEffect(() => {
    commentList({ commentType, targetId, parentId }).then(result => {
      setCommentListState({ initLoading: false, comments: result.data.data });
    }).catch(reason => {
      setCommentListState({ initLoading: false, comments: [] });
    });
  }, [commentType, targetId, parentId]);

  const onLoadMore = useCallback(async (params: { commentType: CommentType, targetId: string, parentId: string, lastCommentId?: string }): Promise<ICommentEntity[]> => {
    const result = await commentList(params);

    if (!result.data.data || result.data.data.length === 0) {
      return [];
    }

    if (params.parentId === '0') {
      const newComments = commentListState.comments.concat(result.data.data);
      setCommentListState({ initLoading: false, comments: newComments });
    } else {
      const newComments = commentListState.comments.slice();
      const commentRef = newComments.find((c) => c.id === params.parentId);
      if (commentRef) {
        if (!commentRef.children) {
          commentRef.children = result.data.data;
        } else {
          commentRef.children = commentRef.children.concat(result.data.data);
        }
      }

      setCommentListState({ initLoading: false, comments: newComments });
    }

    return result.data.data;
  }, [commentListState]);

  const onReplyClick = useCallback((comment: ICommentEntity) => {
    if (!replyComment || replyComment.id !== comment.id) {
      setReplyComment(comment);
    } else {
      setReplyComment(null);
    }
  }, [replyComment]);

  const onSubmit = useCallback(async (pId: string, comment: { rows: IUranusNode[][] }) => {
    const commResult = await safeProps.current.onSubmit(pId, comment);
    const newComments = commentListState.comments.slice();

    if (commResult.parentId === '0') {
      newComments.unshift(commResult);
      setCommentListState({ initLoading: false, comments: newComments });
    } else {
      const commRef = newComments.find((c) => c.id === commResult.parentId);
      if (commRef) {
        if (!commRef.children) {
          commRef.children = [];
        }
        commRef.children.unshift(commResult);
        setCommentListState({ initLoading: false, comments: newComments });
      }
    }

    setReplyComment(null);
    message.success('评论成功');
    // eslint-disable-next-line
  }, [commentListState]);

  const onDelete = useCallback(async (comment: ICommentEntity) => {
    try {
      await safeProps.current.onDelete(comment.id!);
      const newComments = commentListState.comments.slice();

      if (comment.parentId === '0') {
        const index = newComments.findIndex((c) => c.id === comment.id);
        newComments.splice(index, 1);
        setCommentListState({ initLoading: false, comments: newComments });
      } else {
        const commRef = newComments.find((c) => c.id === comment.parentId);
        if (commRef) {
          const index = commRef.children!.findIndex((c => c.id === comment.id));
          commRef.children?.splice(index, 1);
          setCommentListState({ initLoading: false, comments: newComments });
        }
      }

      message.success('删除成功');
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message,
      });
    }
    // eslint-disable-next-line
  }, [commentListState]);

  const { initLoading, comments } = commentListState;

  return (
    <div className={className}>
      <CommentEditor parentId={parentId} avatarVisible={true} clearEditor={true} user={user} onSubmit={onSubmit} />
      <CommentList
        commentType={CommentType.article}
        targetId={targetId}
        parentId={parentId}
        user={user}
        initLoading={initLoading}
        replyComment={replyComment}
        comments={comments}
        onReplyClick={onReplyClick}
        onLoadMore={onLoadMore}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </div>
  );
};