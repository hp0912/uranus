import { LoadingOutlined, PauseCircleOutlined, QuestionCircleOutlined, TransactionOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, Input, message, Popconfirm, Row, Table, Tooltip } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { GoodsType, IOrderEntity, IUserEntity, OrderCode } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { getOrdersForAdmin, orderRefundForAdmin } from '../../utils/httpClient';

// 样式
import componentStyles from '../../components/components.module.css';

interface IAdminOrdersParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IAdminOrdersState {
  searchValue: string;
  data: IOrderEntity[];
  userMap: { [userId: string]: IUserEntity };
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  refunding: boolean;
}

const OrderManagement: FC = () => {
  const [ordersState, setOrdersState] = useSetState<IAdminOrdersState>({
    searchValue: '',
    data: [],
    userMap: {},
    pagination: {
      current: 1,
      pageSize: 15,
      pageSizeOptions: ['15', '50', '100'],
      total: 0,
    },
    currentOPId: null,
    loading: false,
    refunding: false,
  });

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line
  }, []);

  const columns: ColumnsType<IOrderEntity> = [
    {
      title: '标题',
      dataIndex: 'remark',
      width: '27%',
      align: 'left',
      ellipsis: true,
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '订单类型',
      dataIndex: 'goodsType',
      width: '8%',
      align: 'center',
      render: (goodsType: GoodsType) => {
        return <span>{goodsType === GoodsType.article ? '博客' : '其他'}</span>;
      },
    },
    {
      title: '商家',
      dataIndex: 'sellerId',
      width: '12%',
      align: 'center',
      render: (sellerId: string) => {
        return <span>{ordersState.userMap[sellerId] ? ordersState.userMap[sellerId].nickname : '--'}</span>;
      },
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      width: '8%',
      align: 'center',
      render: (totalPrice: number) => {
        return <span>{(totalPrice / 100)} 元</span>;
      },
    },
    {
      title: '支付状态',
      dataIndex: 'code',
      width: '12%',
      align: 'center',
      render: (code: OrderCode) => {
        switch (code) {
          case OrderCode.init:
            return <span>未支付</span>;
          case OrderCode.success:
            return <span>支付成功</span>;
          case OrderCode.failure:
            return <span>支付失败</span>;
          case OrderCode.refunding:
            return <span>等待退款</span>;
          case OrderCode.refund_fail:
            return <span>退款失败</span>;
          case OrderCode.refunded:
            return <span>已退款</span>;
          default:
            return '--';
        }
      },
    },
    {
      title: '买家',
      dataIndex: 'buyerId',
      width: '12%',
      align: 'center',
      render: (buyerId: string) => {
        return <span>{ordersState.userMap[buyerId] ? ordersState.userMap[buyerId].nickname : '--'}</span>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '15%',
      align: 'center',
      render: (createTime: number) => {
        return <span>{formatDate(createTime)}</span>;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: '6%',
      align: 'center',
      render: (e, item) => {
        if (item.code !== OrderCode.success && item.code !== OrderCode.refund_fail) {
          return null;
        }

        return (
          <>
            {
              ordersState.refunding && ordersState.currentOPId === item.id ?
                <LoadingOutlined /> :
                ordersState.refunding ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要对该订单发起退款吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className={componentStyles.uranus_delete_icon} />}
                      onConfirm={() => { onOrderRefund(item.id!); }}
                    >
                      <Tooltip title="退款">
                        <TransactionOutlined />
                      </Tooltip>
                    </Popconfirm>
                  )
            }
          </>
        );
      },
    },
  ];

  const onOrderRefund = useCallback(async (orderId: string) => {
    try {
      setOrdersState({ refunding: true, currentOPId: orderId });
      const { pagination: { current, pageSize }, searchValue } = ordersState;

      await orderRefundForAdmin({ orderId });
      const ordersResult = await getOrdersForAdmin({ pagination: { current, pageSize }, searchValue });
      const { orders, total } = ordersResult.data.data;

      setOrdersState({
        refunding: false,
        currentOPId: null,
        data: orders,
        pagination: {
          ...ordersState.pagination,
          total,
        },
      });

      message.success('发起退款成功，等待服务商处理');
    } catch (ex) {
      message.error(ex.message);
      setOrdersState({ refunding: false, currentOPId: null });
    }
    // eslint-disable-next-line
  }, [ordersState]);

  const getOrders = useCallback(async (params?: IAdminOrdersParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: ordersState.searchValue };
      }

      setOrdersState({ loading: true });

      const ordersResult = await getOrdersForAdmin(params);
      const { orders, users, total } = ordersResult.data.data;
      const userMap: { [userId: string]: IUserEntity } = {};

      users.forEach((user: IUserEntity) => {
        userMap[user.id!] = user;
      });

      setOrdersState({
        loading: false,
        data: orders,
        userMap,
        pagination: {
          ...ordersState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setOrdersState({ loading: false });
    }
    // eslint-disable-next-line
  }, [ordersState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
  ) => {
    const params = { pagination, searchValue: ordersState.searchValue };
    getOrders(params);
  }, [ordersState.searchValue, getOrders]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setOrdersState({ searchValue: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSearch = useCallback(() => {
    if (ordersState.loading) {
      return;
    }
    getOrders();
  }, [ordersState.loading, getOrders]);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>订单管理</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: '#fff' }}>
        <Row className="uranus-row">
          <Col span={16} />
          <Col span={8}>
            <div style={{ textAlign: 'right', paddingBottom: 8 }}>
              <Input.Search
                placeholder="根据订单标题搜索"
                enterButton
                value={ordersState.searchValue}
                onChange={onSearchChange}
                loading={ordersState.loading}
                onSearch={onSearch}
              />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={ordersState.data}
          pagination={ordersState.pagination}
          loading={ordersState.loading}
          onChange={onTableChange}
        />
      </div>
    </>
  );
};

export default OrderManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
      isAdmin: true,
    }
  };
};