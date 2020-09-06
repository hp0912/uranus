import { Input, message, Table } from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table/interface';
import { AxiosPromise } from 'axios';
import React, { FC, useCallback, useEffect } from 'react';
import { GoodsType, IOrderEntity, OrderCode } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';

interface IMyOrdersParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IMyOrdersProps {
  dataSource: (params: { pagination: { current?: number, pageSize?: number }, searchValue?: string }) => AxiosPromise<any>;
}

interface IMyOrdersState {
  searchValue: string;
  data: IOrderEntity[];
  pagination: TablePaginationConfig;
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

const css = { searchWidth: { width: 250 } };

export const MyOrders: FC<IMyOrdersProps> = (props) => {
  const [myOrdersState, setMyOrdersState] = useSetState<IMyOrdersState>({
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
    geMyOrders();
  }, []);

  const columns: ColumnsType<IOrderEntity> = [
    {
      title: '标题',
      dataIndex: 'remark',
      width: '30%',
      align: 'left',
      ellipsis: true,
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    {
      title: '订单类型',
      dataIndex: 'goodsType',
      width: '15%',
      align: 'center',
      render: (goodsType: GoodsType) => {
        return <span>{goodsType === GoodsType.article ? "博客" : "其他"}</span>;
      },
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      width: '15%',
      align: 'center',
      render: (totalPrice: number) => {
        return <span>{(totalPrice / 100)} 元</span>;
      },
    },
    {
      title: '支付状态',
      dataIndex: 'code',
      width: '15%',
      align: 'center',
      render: (code: OrderCode) => {
        switch (code) {
          case OrderCode.init:
            return <span>未支付</span>;
          case OrderCode.success:
            return <span>支付成功</span>;
          case OrderCode.failure:
            return <span>支付失败</span>;
          case OrderCode.refund:
            return <span>已退款</span>;
          default:
            return "--";
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '25%',
      align: 'center',
      render: (createTime: number) => {
        return <span>{formatDate(createTime)}</span>;
      },
    },
  ];

  const geMyOrders = useCallback(async (params?: IMyOrdersParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: myOrdersState.searchValue };
      }

      setMyOrdersState({ loading: true });

      const ordersResult = await props.dataSource(params);
      const { orders, total } = ordersResult.data.data;

      setMyOrdersState({
        loading: false,
        data: orders,
        pagination: {
          ...myOrdersState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setMyOrdersState({ loading: false });
    }
    // eslint-disable-next-line
  }, [myOrdersState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
  ) => {
    const params = { pagination, searchValue: myOrdersState.searchValue };
    geMyOrders(params);
  }, [myOrdersState.searchValue, geMyOrders]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMyOrdersState({ searchValue: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onSearch = useCallback(() => {
    if (myOrdersState.loading) {
      return;
    }
    geMyOrders();
  }, [myOrdersState.loading, geMyOrders]);

  return (
    <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
      <div style={{ marginBottom: 15 }}>
        <Input.Search
          placeholder="根据订单标题搜索"
          style={css.searchWidth}
          enterButton
          value={myOrdersState.searchValue}
          onChange={onSearchChange}
          loading={myOrdersState.loading}
          onSearch={onSearch}
        />
      </div>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={myOrdersState.data}
        pagination={myOrdersState.pagination}
        loading={myOrdersState.loading}
        onChange={onTableChange}
      />
    </div>
  );
};