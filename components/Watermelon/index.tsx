import { Alert, Button, Col, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useCallback, useContext, useState } from 'react';
import { UserContext } from '../../store/user';
import { WatermelonUpload } from './WatermelonUpload';

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
  pathList: Array<{ id: string, path: string, status: number }>;
  selectedPath?: string;
}

const Watermelon = () => {
  const userContext = useContext(UserContext);
  console.log(userContext);

  const [watermelonState, setWatermelonState] = useState<IWatermelonState>({
    loading: false,
    pathList: [],
    selectedPath: undefined,
  });

  const onAddClick = useCallback(() => {
    setWatermelonState({ loading: false, pathList: [] });
  }, []);

  const columns: ColumnsType<{ path: string, status: number }> = [
    {
      title: '游戏路径',
      dataIndex: 'path',
      key: 'path',
      render: (path: string) => {
        return <span>{path}</span>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        return <span>{status}</span>
      },
    },
    {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (operate: string) => {
        return <span>{operate}</span>
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
      />
      <Row className="uranus-row">
        <Col span={4}>
          <span style={{ paddingLeft: 8 }}>选择图片上传路径</span>
        </Col>
        <Col span={18}>
          <Select value={watermelonState.selectedPath} className="uranus-row-select">
            {
              watermelonState.pathList.map(p => {
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
    </div>
  );
}

export default Watermelon;