import { AuditOutlined, DeleteOutlined, FormOutlined, LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, message, Popconfirm, Row, Table, Tooltip } from 'antd';
import { ColumnProps } from 'antd/lib/table/Column';
import { SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { IArticleEntity } from '../../types';
import { useSetState } from '../../utils/commonHooks';

interface IAdminArtListParams {
  sortField?: string;
  sortOrder?: 'descend' | 'ascend' | null | undefined;
  filters?: Record<string, React.ReactText[] | null>;
  pagination: TablePaginationConfig;
}

interface IAdminArtListState {
  data: IArticleEntity[];
  pagination: TablePaginationConfig;
  currentOPId: number | null;
  loading: boolean;
  auditing: boolean;
  deleting: boolean;
}

export const AdminArticleList: FC = (props) => {
  const history = useHistory();
  const match = useRouteMatch();
  
  const [adminAriState, setAdminAriState] = useSetState<IAdminArtListState>({
    data: [],
    pagination: {
      current: 1,
      pageSize: 50,
      total: 0,
    },
    currentOPId: null,
    loading: false,
    auditing: false,
    deleting: false,
  });

  useEffect(() => {
    getArticleList();
  }, []);

  const columns = useMemo<ColumnProps<IArticleEntity>[]>(() => {
    return [
      {
        title: '文章标题',
        dataIndex: 'title',
        width: '20%',
        align: 'left',
        ellipsis: true,
        render: (text: string, item) => {
          return (
            <span className="path">{text}</span>
          );
        },
      },
      {
        title: '审核状态',
        dataIndex: 'auditStatus',
        width: '10%',
        align: 'center',
        filters: [
          { text: '待审核', value: 0 },
          { text: '审核通过', value: 1 },
        ],
        render: (auditStatus, item) => {
          return <span>--</span>;
        },
      },
      {
        title: '创建人',
        dataIndex: 'createdBy',
        width: '10%',
        align: 'center',
        ellipsis: true,
        render: (createdBy, item) => {
          return <span>--</span>;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        width: '15%',
        align: 'center',
        sorter: true,
        render: (createdTime, item) => {
          return <span>--</span>;
        },
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        width: '10%',
        align: 'center',
        sorter: true,
        render: (modifyTime, item) => {
          return <span>--</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: '10%',
        align: 'center',
        render: (text, record) => {
          return (
            <>
              {
                !record.auditStatus && adminAriState.auditing && adminAriState.currentOPId === record.id ?
                <LoadingOutlined className="uranus-audit-icon" /> :
                !record.auditStatus && (adminAriState.auditing || adminAriState.deleting) ?
                <PauseCircleOutlined className="uranus-audit-icon" /> :
                !record.auditStatus ?
                (
                  <Tooltip title="审核">
                    <AuditOutlined className="uranus-audit-icon" />
                  </Tooltip>
                ) :
                null
              }
              {
                adminAriState.deleting && adminAriState.currentOPId === record.id ?
                <LoadingOutlined /> :
                (adminAriState.auditing || adminAriState.deleting) ?
                <PauseCircleOutlined /> :
                (
                  <Popconfirm
                    title="确定要删除该文章吗？"
                    okText="确认"
                    cancelText="取消"
                    icon={<QuestionCircleOutlined className="uranus-delete-icon" />}
                    onConfirm={() => { console.log(1); }}
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
  }, [adminAriState]);

  const getArticleList = useCallback(async (params: IAdminArtListParams = { pagination: { current: 1, pageSize: 50 } }) => {
    try {
      setAdminAriState({ loading: true });
      console.log(1);
      await new Promise<any>((resolve) => {
        setTimeout(() => {
          resolve({} as any);
        }, 2000);
      });
      console.log(2);
      setAdminAriState({
        data: [{
          id: 100001,
          title: "吼吼吼～",
          desc: "xxxxxx",
          content: "xxx",
          tags: [],
          auditStatus: 0,
          createdBy: 0,
          createdTime: 0,
          modifyTime: 0,
        }],
        pagination: {
          ...params.pagination,
          total: 400,
        },
      });
    } catch (ex) {
      message.error(ex.message);
    } finally {
      setAdminAriState({ loading: false });
    }
  }, [setAdminAriState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig, 
    filters: Record<string, React.ReactText[] | null>, 
    sorter: SorterResult<IArticleEntity> | SorterResult<IArticleEntity>[],
  ) => {
    if (!(sorter instanceof Array)) {
      getArticleList({
        sortField: sorter.field as string,
        sortOrder: sorter.order,
        pagination,
        filters,
      });
    }
  }, [getArticleList]);

  const articleAdd = useCallback(() => {
    console.log(match.path);
    history.push(`${match.path}/articleAdd`);
  }, [history, match]);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>文章列表</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
        <Row>
          <Col span={16} />
          <Col span={8}>
            <div style={{ textAlign: "right", paddingBottom: 8 }}>
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