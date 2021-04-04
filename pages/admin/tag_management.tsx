import {
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Col, Input, InputNumber, message, Modal, Popconfirm, Row, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import React, { FC, useCallback, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { SketchPicker } from 'react-color';
import { ITagEntity } from '../../types';
import { useSetState } from '../../utils/commonHooks';
import { tagDelete, tagList, tagSave } from '../../utils/httpClient';

// 样式
import articleEditStyles from '../../components/ArticleEdit/articleEdit.module.css';

interface IAdminArtListState {
  data: ITagEntity[];
  currentOPId: string | null;
  loading: boolean;
  deleting: boolean;
}

interface ITagEditState extends ITagEntity {
  modalTitle: string;
  modalVisible: boolean;
  loading: boolean;
}

const TagManagement: FC = () => {

  const [adminTagState, setAdminTagState] = useSetState<IAdminArtListState>({
    data: [],
    currentOPId: null,
    loading: false,
    deleting: false,
  });

  const [tagEditState, setTagEditState] = useSetState<ITagEditState>({
    modalTitle: '',
    modalVisible: false,
    loading: false,
  });

  useEffect(() => {
    getTagList();
    // eslint-disable-next-line
  }, []);

  const columns: ColumnsType<ITagEntity> = [
    {
      title: '标签名称',
      dataIndex: 'name',
      width: '50%',
      align: 'left',
      ellipsis: true,
      render: (text: string) => {
        return (
          <span>{text}</span>
        );
      },
    },
    {
      title: '标签颜色',
      dataIndex: 'color',
      width: '20%',
      align: 'center',
      render: (color: string) => {
        return <div style={{ width: '100%', height: 25, backgroundColor: color }} />;
      },
    },
    {
      title: '排序',
      dataIndex: 'index',
      width: '20%',
      align: 'center',
      render: (index: number) => {
        return <span>{index}</span>;
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
            <EditOutlined className="uranus-margin-right-8" onClick={() => { onTagEditClick(record); }} />
            {
              adminTagState.deleting && adminTagState.currentOPId === record.id ?
                <LoadingOutlined /> :
                adminTagState.deleting ?
                  <PauseCircleOutlined /> :
                  (
                    <Popconfirm
                      title="确定要删除该标签吗？"
                      okText="确认"
                      cancelText="取消"
                      icon={<QuestionCircleOutlined className={articleEditStyles.uranus_delete_icon} />}
                      onConfirm={() => { onTagDelClick(record.id); }}
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

  const getTagList = useCallback(async () => {
    try {
      setAdminTagState({ loading: true });

      const result = await tagList();

      setAdminTagState({ loading: false, data: result.data.data });
    } catch (ex) {
      message.error(ex.message);
      setAdminTagState({ loading: false });
    }
    // eslint-disable-next-line
  }, []);

  const onTagAddClick = useCallback(() => {
    setTagEditState({
      modalTitle: '添加标签',
      modalVisible: true,
      id: '',
      name: '',
      color: '#fff',
      index: 0,
    });
    // eslint-disable-next-line
  }, []);

  const onTagEditClick = useCallback((record: ITagEntity) => {
    setTagEditState({
      modalTitle: '更新标签',
      modalVisible: true,
      id: record.id,
      name: record.name,
      color: record.color,
      index: record.index,
    });
    // eslint-disable-next-line
  }, []);

  const onTagDelClick = useCallback(async (id?: string) => {
    try {
      setAdminTagState({ deleting: true, currentOPId: id });

      const result = await tagDelete({ id: id as string });
      setAdminTagState({ data: result.data.data, deleting: false, currentOPId: null });

      message.success('删除成功');
    } catch (ex) {
      message.error('删除失败：' + ex.message);
      setAdminTagState({ deleting: false, currentOPId: null });
    }
    // eslint-disable-next-line
  }, []);

  const onTagNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTagEditState({ name: event.target.value });
    // eslint-disable-next-line
  }, []);

  const onChangeComplete = useCallback((color) => {
    setTagEditState({ color: color.hex });
    // eslint-disable-next-line
  }, []);

  const onTagIndexChange = useCallback((value) => {
    setTagEditState({ index: value });
    // eslint-disable-next-line
  }, []);

  const onOk = useCallback(async () => {
    if (tagEditState.name === undefined || tagEditState.name === undefined || tagEditState.name === '') {
      throw new Error('标签名不合法');
    }

    if (tagEditState.name.length > 30) {
      throw new Error('标签名长度不能超过30个字符');
    }

    if (!Number.isInteger(tagEditState.index as number)) {
      throw new Error('标签排序不合法');
    }

    if (!tagEditState.color || !tagEditState.color.match(/^#[0-9a-fA-F]{3,6}$/)) {
      throw new Error('标签颜色不合法');
    }

    try {
      setTagEditState({ loading: true });

      const { id, name, color, index } = tagEditState;
      const result = await tagSave({ id, name, color, index });
      setAdminTagState({ data: result.data.data });
      setTagEditState({ loading: false, modalVisible: false });

      message.success('保存成功');
    } catch (ex) {
      message.error('保存失败：' + ex.message);
      setTagEditState({ loading: false });
    }
    // eslint-disable-next-line
  }, [tagEditState]);

  const onCancel = useCallback(() => {
    setTagEditState({
      modalTitle: '',
      modalVisible: false,
      id: '',
      name: '',
      color: '#fff',
      index: 0,
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>标签管理</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: '#fff' }}>
        <Row>
          <Col span={16} />
          <Col span={8}>
            <div style={{ textAlign: 'right', paddingBottom: 8 }}>
              <Button
                type="primary"
                icon={<FormOutlined />}
                onClick={onTagAddClick}
              >
                添加标签
              </Button>
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={adminTagState.data}
          pagination={false}
          loading={adminTagState.loading}
        />
      </div>
      <Modal
        title={tagEditState.modalTitle}
        visible={tagEditState.modalVisible}
        destroyOnClose
        centered
        confirmLoading={tagEditState.loading}
        onOk={onOk}
        onCancel={onCancel}
      >
        <div>
          <Row className="uranus-row">
            <Col span={5}>
              标签名：
            </Col>
            <Col span={19}>
              <Input value={tagEditState.name} onChange={onTagNameChange} />
            </Col>
          </Row>
          <Row className="uranus-row">
            <Col span={5}>
              标签颜色：
            </Col>
            <Col span={19}>
              <SketchPicker
                color={tagEditState.color}
                onChangeComplete={onChangeComplete}
              />
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              标签排序：
            </Col>
            <Col span={19}>
              <InputNumber value={tagEditState.index} precision={0} onChange={onTagIndexChange} />
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default TagManagement;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      userState: null,
      isAdmin: true,
    }
  };
};