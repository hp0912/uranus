import { DeleteOutlined, EditOutlined, FormOutlined, LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, Input, message, Popconfirm, Row, Switch, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { AuditStatus, IArticleEntity, IUserEntity } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { articleAudit, articleDeleteForAdmin, articleListForAdmin } from '../../utils/httpClient';

// 样式
import componentStyles from '../../components/components.module.css';

interface IAdminArtListParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IAdminArtListState {
  searchValue: string;
  data: IArticleEntity[];
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

const ArticleManagement: FC = () => {
  const router = useRouter();

  const [userMap, setUserMap] = useState<{ [userId: string]: IUserEntity }>({});
  const [adminAriState, setAdminAriState] = useSetState<IAdminArtListState>({
    searchValue: '',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      pageSizeOptions: ['15', '50', '100'],
      showQuickJumper: true,
      total: 0,
    },
    currentOPId: null,
    loading: false,
    deleting: false,
  });

  useEffect(() => {
    getArticleList();
    // eslint-disable-next-line
  }, []);

  const columns: ColumnsType<IArticleEntity> = [
    {
      title: '文章标题',
      dataIndex: 'title',
      width: '15%',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '文章简介',
      dataIndex: 'desc',
      width: '30%',
      align: 'left',
      ellipsis: true,
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: '10%',
      align: 'center',
      render: (auditStatus: AuditStatus, item) => {
        return (
          <Switch
            checkedChildren="审核通过"
            unCheckedChildren="待审核"
            checked={auditStatus === AuditStatus.approved}
            onChange={(checked: boolean) => { onAuditStatusChange(checked, item.id); }}
          />
        );
      },
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
      width: '10%',
      align: 'center',
      ellipsis: true,
      render: (createdBy: string) => {
        return <span>{userMap[createdBy]?.nickname}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: '15%',
      align: 'center',
      sorter: true,
      render: (createdTime: number) => {
        return <span>{formatDate(createdTime)}</span>;
      },
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      width: '15%',
      align: 'center',
      sorter: true,
      render: (modifyTime: number) => {
        return <span>{formatDate(modifyTime)}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '5%',
      align: 'center',
      render: (text, record) => {
        return (
          <>
            {
              (
                <a href={`/admin/article_edit/${record.id}`} target="_blank" rel="noopener noreferrer">
                  <EditOutlined className="uranus-margin-right-8" />
                </a>
              )
            }
            {
              adminAriState.deleting && adminAriState.currentOPId === record.id ?
                <LoadingOutlined /> :
                adminAriState.deleting ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要删除该文章吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className={componentStyles.uranus_delete_icon} />}
                      onConfirm={() => { onArticleDelete(record.id); }}
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

  const onAction = useCallback(async (action: () => Promise<void>) => {
    try {
      setAdminAriState({ loading: true });
      const { pagination: { current, pageSize }, searchValue } = adminAriState;

      await action();
      const articlesResult = await articleListForAdmin({ pagination: { current, pageSize }, searchValue });
      const { articles, users, total } = articlesResult.data.data;

      const _userMap: { [userId: string]: IUserEntity } = {};
      (users as IUserEntity[]).forEach(user => {
        _userMap[user.id as string] = user;
      });

      setAdminAriState({
        loading: false,
        data: articles,
        pagination: {
          ...adminAriState.pagination,
          total,
        },
      });
      setUserMap(_userMap);
    } catch (ex) {
      message.error(ex.message);
      setAdminAriState({ loading: false });
    }
  }, [adminAriState, setAdminAriState]);

  const onAuditStatusChange = useCallback(async (checked: boolean, articleId?: string) => {
    onAction(async () => { await articleAudit({ articleId: articleId as string, auditStatus: checked ? AuditStatus.approved : AuditStatus.unapprove }); });
  }, [onAction]);

  const onArticleDelete = useCallback(async (articleId?: string) => {
    onAction(async () => { await articleDeleteForAdmin({ articleId: articleId as string }); });
  }, [onAction]);

  const getArticleList = useCallback(async (params?: IAdminArtListParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: adminAriState.searchValue };
      }

      setAdminAriState({ loading: true });

      const articlesResult = await articleListForAdmin(params);
      const { articles, users, total } = articlesResult.data.data;

      const _userMap: { [userId: string]: IUserEntity } = {};
      (users as IUserEntity[]).forEach(user => {
        _userMap[user.id as string] = user;
      });

      setUserMap(_userMap);
      setAdminAriState({
        loading: false,
        data: articles,
        pagination: {
          ...adminAriState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setAdminAriState({ loading: false });
    }
    // eslint-disable-next-line
  }, [adminAriState]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminAriState({ searchValue: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSearch = useCallback(() => {
    if (adminAriState.loading) {
      return;
    }
    getArticleList();
  }, [adminAriState.loading, getArticleList]);

  const onTableChange = useCallback((pagination: TablePaginationConfig) => {
    const params = { pagination, searchValue: adminAriState.searchValue };
    getArticleList(params);
  }, [adminAriState.searchValue, getArticleList]);

  const articleAdd = useCallback(() => {
    router.push('/admin/article_edit/new');
  }, [router]);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>文章列表</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: '#fff' }}>
        <Row>
          <Col span={16}>
            <div style={{ textAlign: 'left', paddingBottom: 8, width: 300 }}>
              <Input.Search
                placeholder="根据文章标题、简介搜索"
                enterButton
                value={adminAriState.searchValue}
                onChange={onSearchChange}
                loading={adminAriState.loading}
                onSearch={onSearch}
              />
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'right', paddingBottom: 8 }}>
              <Button
                type="primary"
                icon={<FormOutlined />}
                onClick={articleAdd}
              >
                写文章
              </Button>
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={adminAriState.data}
          pagination={adminAriState.pagination}
          loading={adminAriState.loading}
          onChange={onTableChange}
        />
      </div>
    </>
  );
};

export default ArticleManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
      isAdmin: true,
    }
  };
};