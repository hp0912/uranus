import { DeleteOutlined, EditOutlined, LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuditStatus, IArticleEntity } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { articleDelete, myArticles } from '../../utils/httpClient';

interface IMyBlogParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IMyBlogState {
  searchValue: string;
  data: IArticleEntity[];
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

const css = { searchWidth: { width: 250 } };

export const MyBlog: FC = () => {
  const [myBlogState, setMyBlogState] = useSetState<IMyBlogState>({
    searchValue: '',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      pageSizeOptions: ["15", "50", "100"],
      total: 0,
    },
    currentOPId: null,
    loading: false,
    deleting: false,
  });

  useEffect(() => {
    geMyBlogs();
  }, []);

  const columns: ColumnsType<IArticleEntity> = [
    {
      title: '标题',
      dataIndex: 'title',
      width: '50%',
      align: 'left',
      ellipsis: true,
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '创作时间',
      dataIndex: 'createdTime',
      width: '25%',
      align: 'center',
      render: (createdTime: number) => {
        return <span>{formatDate(createdTime)}</span>;
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: '15%',
      align: 'center',
      render: (auditStatus: AuditStatus) => {
        return <span>{auditStatus === AuditStatus.approved ? "通过" : "未通过"}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '10%',
      align: 'center',
      render: (e, item) => {
        return (
          <>
            <Link to={`/article/edit/${item.id}`}>
              <EditOutlined className="uranus-margin-right-8" />
            </Link>
            {
              myBlogState.deleting && myBlogState.currentOPId === item.id ?
                <LoadingOutlined /> :
                myBlogState.deleting ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要删除该博客吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className="uranus-delete-icon" />}
                      onConfirm={() => { onMyBlogDelete(item.id!); }}
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

  const onMyBlogDelete = useCallback(async (articleId: string) => {
    try {
      setMyBlogState({ deleting: true, currentOPId: articleId });
      const { pagination: { current, pageSize }, searchValue } = myBlogState;

      await articleDelete({ id: articleId });
      const articlesResult = await myArticles({ pagination: { current, pageSize }, searchValue });
      const { articles, total } = articlesResult.data.data;

      setMyBlogState({
        deleting: false,
        currentOPId: null,
        data: articles,
        pagination: {
          ...myBlogState.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMyBlogState({ deleting: false, currentOPId: null });
    }
    // eslint-disable-next-line
  }, [myBlogState]);

  const geMyBlogs = useCallback(async (params?: IMyBlogParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: myBlogState.searchValue };
      }

      setMyBlogState({ loading: true });

      const articlesResult = await myArticles(params);
      const { articles, total } = articlesResult.data.data;

      setMyBlogState({
        loading: false,
        data: articles,
        pagination: {
          ...myBlogState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMyBlogState({ loading: false });
    }
    // eslint-disable-next-line
  }, [myBlogState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
  ) => {
    const params = { pagination, searchValue: myBlogState.searchValue };
    geMyBlogs(params);
  }, [myBlogState.searchValue, geMyBlogs]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMyBlogState({ searchValue: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSearch = useCallback(() => {
    if (myBlogState.loading) {
      return;
    }
    geMyBlogs();
  }, [myBlogState.loading, geMyBlogs]);

  return (
    <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
      <div style={{ marginBottom: 15 }}>
        <Input.Search
          placeholder="根据博客标题/内容搜索"
          style={css.searchWidth}
          enterButton
          value={myBlogState.searchValue}
          onChange={onSearchChange}
          loading={myBlogState.loading}
          onSearch={onSearch}
        />
      </div>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={myBlogState.data}
        pagination={myBlogState.pagination}
        loading={myBlogState.loading}
        onChange={onTableChange}
      />
    </div>
  );
};