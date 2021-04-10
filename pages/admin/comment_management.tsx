import React, { FC, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { DeleteOutlined, LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Input, message, Popconfirm, Row, Switch, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import { CommentType, ICommentEntity } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { commentAudit, commentDeleteForAdmin, commentListForAdmin } from '../../utils/httpClient';

// 样式
import CommentStyles from '../../components/UranusComment/comment.module.css';
import componentStyles from '../../components/components.module.css';

interface IAdminCommentsParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IAdminCommentsState {
  searchValue: string;
  data: ICommentEntity[];
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

const CommentManagement: FC = () => {
  const [commentsState, setCommentsState] = useSetState<IAdminCommentsState>({
    searchValue: '',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      pageSizeOptions: ['15', '50', '100'],
      total: 0,
    },
    currentOPId: null,
    loading: false,
    deleting: false,
  });

  useEffect(() => {
    getComments();
    // eslint-disable-next-line
  }, []);

  const columns: ColumnsType<ICommentEntity> = [
    {
      title: '评论',
      dataIndex: 'content',
      width: '40%',
      align: 'left',
      ellipsis: true,
      render: (text: string) => {
        return <div className={CommentStyles.container} dangerouslySetInnerHTML={{ __html: text }} />;
      },
    },
    {
      title: '类别',
      dataIndex: 'commentType',
      width: '10%',
      align: 'left',
      render: (commentType: CommentType) => {
        switch (commentType) {
          case CommentType.article:
            return <span>文章</span>;
          default:
            return <span>未知</span>;
        }
      },
    },
    {
      title: '评论作者',
      dataIndex: 'userNicname',
      width: '15%',
      align: 'left',
      ellipsis: true,
      render: (userNicname: string) => {
        return <span>{userNicname}</span>;
      },
    },
    {
      title: '评论时间',
      dataIndex: 'addtime',
      width: '15%',
      align: 'center',
      render: (addtime: number) => {
        return <span>{formatDate(addtime)}</span>;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'passed',
      width: '10%',
      align: 'center',
      render: (passed: boolean, item) => {
        return (
          <Switch
            checkedChildren="审核通过"
            unCheckedChildren="审核不通过"
            checked={passed}
            onChange={(checked: boolean) => { onCommentPassedChange(checked, item.id!); }}
          />
        );
      },
    },
    {
      title: '删除',
      dataIndex: 'delete',
      width: '10%',
      align: 'center',
      render: (e, item) => {
        return (
          <>
            {
              commentsState.deleting && commentsState.currentOPId === item.id ?
                <LoadingOutlined /> :
                commentsState.deleting ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要删除该评论吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className={componentStyles.uranus_delete_icon} />}
                      onConfirm={() => { onCommentDelete(item.id!); }}
                    >
                      <Tooltip title="删除">
                        <DeleteOutlined />
                      </Tooltip>
                    </Popconfirm>
                  )
            }
          </>
        );
      },
    },
  ];

  const onCommentPassedChange = useCallback(async (checked: boolean, commentId: string) => {
    try {
      setCommentsState({ loading: true });
      const { pagination: { current, pageSize }, searchValue } = commentsState;

      await commentAudit({ commentId, passed: checked });
      const commentsResult = await commentListForAdmin({ pagination: { current, pageSize }, searchValue });
      const { comments, total } = commentsResult.data.data;

      setCommentsState({
        loading: false,
        data: comments,
        pagination: {
          ...commentsState.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setCommentsState({ loading: false });
    }
  }, [commentsState, setCommentsState]);

  const onCommentDelete = useCallback(async (commentId: string) => {
    try {
      setCommentsState({ deleting: true, currentOPId: commentId });
      const { pagination: { current, pageSize }, searchValue } = commentsState;

      await commentDeleteForAdmin({ commentId });
      const commentsResult = await commentListForAdmin({ pagination: { current, pageSize }, searchValue });
      const { comments, total } = commentsResult.data.data;

      setCommentsState({
        deleting: false,
        currentOPId: null,
        data: comments,
        pagination: {
          ...commentsState.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setCommentsState({ deleting: false, currentOPId: null });
    }
  }, [commentsState, setCommentsState]);

  const getComments = useCallback(async (params?: IAdminCommentsParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: commentsState.searchValue };
      }

      setCommentsState({ loading: true });

      const commentsResult = await commentListForAdmin(params);
      const { comments, total } = commentsResult.data.data;

      setCommentsState({
        loading: false,
        data: comments,
        pagination: {
          ...commentsState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setCommentsState({ loading: false });
    }
  }, [commentsState, setCommentsState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
  ) => {
    const params = { pagination, searchValue: commentsState.searchValue };
    getComments(params);
  }, [commentsState.searchValue, getComments]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCommentsState({ searchValue: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSearch = useCallback(() => {
    if (commentsState.loading) {
      return;
    }
    getComments();
  }, [commentsState.loading, getComments]);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>评论管理</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: '#fff' }}>
        <Row className="uranus-row">
          <Col span={16} />
          <Col span={8}>
            <div style={{ textAlign: 'right', paddingBottom: 8 }}>
              <Input.Search
                placeholder="根据评论内容搜索"
                enterButton
                value={commentsState.searchValue}
                onChange={onSearchChange}
                loading={commentsState.loading}
                onSearch={onSearch}
              />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={commentsState.data}
          pagination={commentsState.pagination}
          loading={commentsState.loading}
          onChange={onTableChange}
        />
      </div>
    </>
  );
};

export default CommentManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
      isAdmin: true,
    }
  };
};