import { Alert, Button, Col, Input, message, Modal, Row, Select, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../store/user';
import { GoodsType, IOrderEntity, PayCode } from '../../types';
import { generateOrder, watermelonPathAdd, watermelonPathGet } from '../../utils/httpClient';
import { WatermelonUpload } from './WatermelonUpload';
import { SmileOutlined, PayCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Pay } from '../Pay';

const WatermelonInfo = [
  {
    dir: 'ad',
    name: '葡萄',
    filename: 'ad16ccdc-975e-4393-ae7b-8ac79c3795f2.png',
    desc: '52 x 52'
  },
  {
    dir: '0c',
    name: '樱桃',
    filename: '0cbb3dbb-2a85-42a5-be21-9839611e5af7.png',
    desc: '80 x 80'
  },
  {
    dir: 'd0',
    name: '橘子',
    filename: 'd0c676e4-0956-4a03-90af-fee028cfabe4.png',
    desc: '108 x 108'
  },
  {
    dir: '74',
    name: '柠檬',
    filename: '74237057-2880-4e1f-8a78-6d8ef00a1f5f.png',
    desc: '119 x 119'
  },
  {
    dir: '13',
    name: '猕猴桃',
    filename: '132ded82-3e39-4e2e-bc34-fc934870f84c.png',
    desc: '153 x 152'
  },
  {
    dir: '03',
    name: '西红柿',
    filename: '03c33f55-5932-4ff7-896b-814ba3a8edb8.png',
    desc: '183 x 183'
  },
  {
    dir: '66',
    name: '桃',
    filename: '665a0ec9-6c43-4858-974c-025514f2a0e7.png',
    desc: '193 x 193'
  },
  {
    dir: '84',
    name: '菠萝',
    filename: '84bc9d40-83d0-480c-b46a-3ef59e603e14.png',
    desc: '258 x 258'
  },
  {
    dir: '5f',
    name: '椰子',
    filename: '5fa0264d-acbf-4a7b-8923-c106ec3b9215.png',
    desc: '308 x 308'
  },
  {
    dir: '56',
    name: '西瓜',
    filename: '564ba620-6a55-4cbe-a5a6-6fa3edd80151.png',
    desc: '308 x 309'
  },
  {
    dir: '50',
    name: '大西瓜',
    filename: '5035266c-8df3-4236-8d82-a375e97a0d9c.png',
    desc: '408 x 408'
  },
  {
    dir: '8c',
    name: '右上角闪图1',
    filename: '8c52a851-9969-4702-9997-0a2ca9f43773.png',
    desc: '216 x 216'
  },
  {
    dir: '47',
    name: '右上角闪图2',
    filename: '4756311b-4364-4160-bc7e-299876f49770.png',
    desc: '216 x 216'
  },
  {
    dir: '85',
    name: '背景图',
    filename: '856267d0-6891-4660-a28a-3eb110bf6395.png',
    desc: '720 x 1280'
  },
];

interface IWatermelonState {
  loading: boolean;
  visible?: boolean;
  pathList: Array<{ id: string, path: string, code: PayCode }>;
  selectedPath?: string;
  inputPath?: string;
}

const Watermelon = () => {
  const userContext = useContext(UserContext);

  const [payState, setPayState] = useState<{ visible: boolean, order: IOrderEntity | null }>({ visible: false, order: null });
  const [orderLoading, setOrderLoading] = useState(false);
  const [watermelonState, setWatermelonState] = useState<IWatermelonState>({
    loading: true,
    pathList: [],
    visible: false,
    selectedPath: undefined,
    inputPath: '',
  });

  useEffect(() => {
    if (userContext.userState) {
      watermelonPathGet().then(res => {
        setWatermelonState({ loading: false, pathList: res.data.data, selectedPath: undefined });
      }).catch(reason => {
        message.error(reason.message);
        setWatermelonState({ loading: false, pathList: [], selectedPath: undefined });
      });
    } else {
      Modal.warn({ title: '未登录', content: '登录后才能合成大西瓜' });
    }
  }, [userContext.userState]);

  const onSelectedPathChange = useCallback((value: string) => {
    setWatermelonState((prev) => {
      return Object.assign({}, prev, { selectedPath: value });
    });
  }, []);

  const onAddClick = useCallback(() => {
    setWatermelonState((prev) => {
      return Object.assign({}, prev, { visible: true });
    });
  }, []);

  const onAddPathOk = useCallback(async () => {
    try {
      setWatermelonState((prev) => {
        return Object.assign({}, prev, { loading: true });
      });

      if (!watermelonState.inputPath) {
        throw new Error('游戏路径不能为空');
      }

      if (watermelonState.inputPath.length < 3) {
        throw new Error('游戏路径长度不能小于3');
      }

      if (!watermelonState.inputPath.match(/^[a-zA-Z0-9_-]+$/)) {
        throw new Error('游戏路径包含非法字符');
      }

      const res = await watermelonPathAdd({ path: watermelonState.inputPath! });
      setWatermelonState((prev) => {
        return Object.assign({}, prev, { visible: false, inputPath: '', loading: false, pathList: res.data.data });
      });
    } catch (ex) {
      message.error(ex.message);
      setWatermelonState((prev) => {
        return Object.assign({}, prev, { loading: false });
      });
    }
  }, [watermelonState.inputPath]);

  const onAddPathCancel = useCallback(() => {
    setWatermelonState((prev) => {
      return Object.assign({}, prev, { visible: false, inputPath: '' });
    });
  }, []);

  const onPathChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
    setWatermelonState((prev) => {
      return Object.assign({}, prev, { inputPath: ev.target.value });
    });
  }, []);

  const onPayClick = useCallback(async (pathId: string) => {
    try {
      setOrderLoading(true);

      const orderResult = await generateOrder({ goodsType: GoodsType.watermelon, goodsId: pathId });

      setOrderLoading(false);
      setPayState({ visible: true, order: orderResult.data.data });
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message,
      });
      setOrderLoading(false);
    }
  }, []);

  const onGenOrderCancle = useCallback(() => {
    setPayState({ visible: false, order: null });
  }, []);

  const onPaySuccess = useCallback(async () => {
    setPayState({ visible: false, order: null });
    watermelonPathGet().then(res => {
      setWatermelonState(prev => {
        const newState = Object.assign({}, prev);
        newState.pathList = res.data.data;
        return newState;
      });
    }).catch(reason => {
      message.error(reason.message);
    });
  }, []);

  const columns: ColumnsType<{ id: string, path: string, code: PayCode }> = [
    {
      title: '游戏路径',
      dataIndex: 'path',
      key: 'path',
      align: 'left',
      render: (path: string) => {
        return <span>{path}</span>
      },
    },
    {
      title: '状态',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      render: (code: PayCode) => {
        if (code === PayCode.init) {
          return <span style={{ color: 'yellowgreen' }}>待支付</span>
        } else if (code === PayCode.success) {
          return <span style={{ color: 'green' }}>支付成功</span>
        }
        return <span style={{ color: 'red' }}>支付失败</span>
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      align: 'right',
      render: (operate: string, item) => {
        if (item.code === PayCode.success) {
          return <SmileOutlined style={{ color: 'green' }} />;
        }
        if (orderLoading) {
          return <LoadingOutlined />;
        }
        return (
          <Tooltip title="去支付">
            <PayCircleOutlined
              style={{ color: 'cadetblue' }}
              onClick={() => onPayClick(item.id)}
            />
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ padding: 5 }}>
        <Alert
          message="温馨提醒"
          description="DIY合成大西瓜之前，需要设置游戏路径。设置之后通过 https://m.houhoukang.com/<你设置的路径>访问。路径至少三个字符，只能包含字母、数字、下划线、中划线，且以字母开头。比如你设置的路径是x001，则通过https://m.houhoukang.com/x001 访问游戏。"
          type="info"
          showIcon
          closable
        />
      </div>
      <Row className="uranus-row">
        <Col span={20} />
        <Col span={4} style={{ textAlign: 'right', padding: '8px 8px 0 0' }}>
          <Button
            type="primary"
            loading={watermelonState.loading}
            disabled={!userContext.userState}
            onClick={onAddClick}
          >
            添加游戏路径
          </Button>
        </Col>
      </Row>
      <Table
        className="uranus-row"
        columns={columns}
        loading={watermelonState.loading}
        dataSource={watermelonState.pathList}
        pagination={false}
        rowKey="id"
      />
      <Row className="uranus-row">
        <Col span={4}>
          <span style={{ paddingLeft: 8 }}>选择图片上传路径</span>
        </Col>
        <Col span={18}>
          <Select value={watermelonState.selectedPath} className="uranus-row-select" onChange={onSelectedPathChange}>
            {
              watermelonState.pathList.filter(item => {
                return item.code === PayCode.success;
              }).map(p => {
                return (
                  <Select.Option key={p.path} value={p.path}>{p.path}</Select.Option>
                );
              })
            }
          </Select>
        </Col>
        <Col span={2} className="save">
          <Button
            type="primary"
            disabled={!watermelonState.selectedPath}
          >
            上传
          </Button>
        </Col>
      </Row>
      <div style={{
        margin: 5,
        padding: 15,
        border: '1px solid gray',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap'
      }}>
        {
          WatermelonInfo.map(wm => {
            return (
              <WatermelonUpload key={wm.filename} {...wm} />
            );
          })
        }
      </div>
      <Modal
        title="添加游戏路径"
        visible={watermelonState.visible}
        confirmLoading={watermelonState.loading}
        destroyOnClose
        onOk={onAddPathOk}
        onCancel={onAddPathCancel}
      >
        <Row>
          <Col span={4}>游戏路径</Col>
          <Col span={20}><Input value={watermelonState.inputPath} onChange={onPathChange} /></Col>
        </Row>
      </Modal>
      {
        payState.order &&
        (
          <Pay
            title="购买游戏路径"
            visible={payState.visible}
            order={payState.order}
            onSuccess={onPaySuccess}
            onCancel={onGenOrderCancle}
          />
        )
      }
    </div>
  );
}

export default Watermelon;