import { DeleteOutlined, EditOutlined, LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Input, message, Popconfirm, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuditStatus, IArticleEntity } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { articleDelete, myArticles } from '../../utils/httpClient';

interface IMyReceivablesParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IMyReceivablesState {
  searchValue: string;
  data: IArticleEntity[];
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

const css = { searchWidth: { width: 250 } };

export const MyReceivables: FC = () => {
  const [myReceivablesState, setMyReceivablesState] = useSetState<IMyReceivablesState>({
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
    geMyReceivabless();
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
              myReceivablesState.deleting && myReceivablesState.currentOPId === item.id ?
                <LoadingOutlined /> :
                myReceivablesState.deleting ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要删除该博客吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className="uranus-delete-icon" />}
                      onConfirm={() => { onMyReceivablesDelete(item.id!); }}
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

  const onMyReceivablesDelete = useCallback(async (articleId: string) => {
    try {
      setMyReceivablesState({ deleting: true, currentOPId: articleId });
      const { pagination: { current, pageSize }, searchValue } = myReceivablesState;

      await articleDelete({ id: articleId });
      const articlesResult = await myArticles({ pagination: { current, pageSize }, searchValue });
      const { articles, total } = articlesResult.data.data;

      setMyReceivablesState({
        deleting: false,
        currentOPId: null,
        data: articles,
        pagination: {
          ...myReceivablesState.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMyReceivablesState({ deleting: false, currentOPId: null });
    }
  }, [myReceivablesState]);

  const geMyReceivabless = useCallback(async (params?: IMyReceivablesParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: myReceivablesState.searchValue };
      }

      setMyReceivablesState({ loading: true });

      const articlesResult = await myArticles(params);
      const { articles, total } = articlesResult.data.data;

      setMyReceivablesState({
        loading: false,
        data: articles,
        pagination: {
          ...myReceivablesState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMyReceivablesState({ loading: false });
    }
  }, [myReceivablesState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
  ) => {
    const params = { pagination, searchValue: myReceivablesState.searchValue };
    geMyReceivabless(params);
  }, [myReceivablesState.searchValue, geMyReceivabless]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMyReceivablesState({ searchValue: event.target.value });
  }, []);

  const onSearch = useCallback(() => {
    if (myReceivablesState.loading) {
      return;
    }
    geMyReceivabless();
  }, [myReceivablesState.loading, geMyReceivabless]);

  return (
    <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
      <div style={{ marginBottom: 15 }}>
        <Input.Search
          placeholder="根据博客标题/内容搜索"
          style={css.searchWidth}
          enterButton
          value={myReceivablesState.searchValue}
          onChange={onSearchChange}
          loading={myReceivablesState.loading}
          onSearch={onSearch}
        />
      </div>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={myReceivablesState.data}
        pagination={myReceivablesState.pagination}
        loading={myReceivablesState.loading}
        onChange={onTableChange}
      />
    </div>
  );
};