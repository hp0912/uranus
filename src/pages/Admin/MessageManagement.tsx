import { DeleteOutlined, LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Input, message, Popconfirm, Row, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect } from 'react';
import { IMessageEntity } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { messageDeleteForAdmin, messageListForAdmin } from '../../utils/httpClient';

interface IAdminMessagesParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IAdminMessagesState {
  searchValue: string;
  data: IMessageEntity[];
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

export const MessageManagement: FC = () => {
  const [messagesState, setMessagesState] = useSetState<IAdminMessagesState>({
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
    getMessages();
    // eslint-disable-next-line
  }, []);

  const columns: ColumnsType<IMessageEntity> = [
    {
      title: '留言',
      dataIndex: 'content',
      width: '50%',
      align: 'left',
      ellipsis: true,
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '留言作者',
      dataIndex: 'userNicname',
      width: '20%',
      align: 'left',
      ellipsis: true,
      render: (userNicname: string) => {
        return <span>{userNicname}</span>;
      },
    },
    {
      title: '留言时间',
      dataIndex: 'addtime',
      width: '20%',
      align: 'center',
      render: (addtime: number) => {
        return <span>{formatDate(addtime)}</span>;
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
              messagesState.deleting && messagesState.currentOPId === item.id ?
                <LoadingOutlined /> :
                messagesState.deleting ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要删除该评论吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className="uranus-delete-icon" />}
                      onConfirm={() => { onMessageDelete(item.id!); }}
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

  const onMessageDelete = useCallback(async (messageId: string) => {
    try {
      setMessagesState({ deleting: true, currentOPId: messageId });
      const { pagination: { current, pageSize }, searchValue } = messagesState;

      await messageDeleteForAdmin({ messageId });
      const messagesResult = await messageListForAdmin({ pagination: { current, pageSize }, searchValue });
      const { messages, total } = messagesResult.data.data;

      setMessagesState({
        deleting: false,
        currentOPId: null,
        data: messages,
        pagination: {
          ...messagesState.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMessagesState({ deleting: false, currentOPId: null });
    }
  }, [messagesState, setMessagesState]);

  const getMessages = useCallback(async (params?: IAdminMessagesParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: messagesState.searchValue };
      }

      setMessagesState({ loading: true });

      const messagesResult = await messageListForAdmin(params);
      const { messages, total } = messagesResult.data.data;

      setMessagesState({
        loading: false,
        data: messages,
        pagination: {
          ...messagesState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMessagesState({ loading: false });
    }
  }, [messagesState, setMessagesState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
  ) => {
    const params = { pagination, searchValue: messagesState.searchValue };
    getMessages(params);
  }, [messagesState.searchValue, getMessages]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessagesState({ searchValue: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSearch = useCallback(() => {
    if (messagesState.loading) {
      return;
    }
    getMessages();
  }, [messagesState.loading, getMessages]);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>留言管理</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
        <Row className="uranus-row">
          <Col span={16} />
          <Col span={8}>
            <div style={{ textAlign: "right", paddingBottom: 8 }}>
              <Input.Search
                placeholder="根据留言内容搜索"
                enterButton
                value={messagesState.searchValue}
                onChange={onSearchChange}
                loading={messagesState.loading}
                onSearch={onSearch}
              />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={messagesState.data}
          pagination={messagesState.pagination}
          loading={messagesState.loading}
          onChange={onTableChange}
        />
      </div>
    </>
  );
};