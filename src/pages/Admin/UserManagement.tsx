import { BellOutlined, EditOutlined } from '@ant-design/icons';
import { Breadcrumb, Col, DatePicker, Input, InputNumber, message, Modal, Row, Space, Switch, Table } from 'antd';
import { ColumnsType, SorterResult, TablePaginationConfig } from 'antd/lib/table/interface';
import moment, { Moment } from 'moment';
import React, { FC, useCallback, useEffect } from 'react';
import { INotificationEntity, IUserEntity } from '../../types';
import { formatDate } from '../../utils';
import { useSetState } from '../../utils/commonHooks';
import { sendNotification, updateUserForAdmin, userList } from '../../utils/httpClient';

interface IAdminUserListParams {
  searchValue: string;
  pagination: TablePaginationConfig;
}

interface IAdminUserListState {
  searchValue: string;
  data: IUserEntity[];
  pagination: TablePaginationConfig;
  loading: boolean;
}

interface IUserEditState {
  data: IUserEntity | null;
  visible: boolean;
  loading: boolean;
}

interface IUserNotiState {
  data: INotificationEntity | null;
  username: string | null;
  broadcast: boolean;
  visible: boolean;
  loading: boolean;
}

export const UserManagement: FC = (props) => {
  const [adminUserState, setAdminUserState] = useSetState<IAdminUserListState>({
    searchValue: '',
    data: [],
    pagination: {
      current: 1,
      pageSize: 15,
      pageSizeOptions: ["15", "50", "100"],
      showQuickJumper: true,
      total: 0,
    },
    loading: false,
  });
  const [userEditState, setUserEditState] = useSetState<IUserEditState>({ data: null, visible: false, loading: false });
  const [userNotiState, setUserNotiState] = useSetState<IUserNotiState>({ data: null, broadcast: false, username: null, visible: false, loading: false });

  useEffect(() => {
    getUserList();
  }, []);

  const columns: ColumnsType<IUserEntity> = [
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      width: '12%',
      align: 'left',
      ellipsis: true,
      render: (text: string, item) => {
        return (
          <span>{text}</span>
        );
      },
    },
    {
      title: '个性签名',
      dataIndex: 'signature',
      width: '20%',
      align: 'left',
      ellipsis: true,
      render: (signature: string, item) => {
        return <span>{signature}</span>;
      },
    },
    {
      title: '个人简介',
      dataIndex: 'personalProfile',
      width: '35%',
      align: 'left',
      ellipsis: true,
      render: (personalProfile: string, item) => {
        return <span>{personalProfile}</span>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registerTime',
      width: '16%',
      align: 'center',
      render: (registerTime: number, item) => {
        return <span>{formatDate(registerTime)}</span>;
      },
    },
    {
      title: '用户等级',
      dataIndex: 'accessLevel',
      width: '8%',
      align: 'center',
      render: (accessLevel: number, item) => {
        return <span>{accessLevel}</span>;
      },
    },
    {
      title: '用户状态',
      dataIndex: 'activated',
      width: '8%',
      align: 'center',
      render: (activated: boolean, item) => {
        return (
          <Switch
            checkedChildren="激活"
            unCheckedChildren="注销"
            checked={activated}
            onChange={(checked: boolean) => { onUserActivatedChange(checked, item.id); }}
          />
        );
      },
    },
    {
      title: '编辑',
      dataIndex: 'edit',
      width: '6%',
      align: 'center',
      render: (edit, item) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                setUserEditState({ data: item, visible: true });
              }}
            />
            <BellOutlined
              className="uranus-margin-left8"
              onClick={() => {
                setUserNotiState({ data: { userId: item.id }, visible: true, username: item.nickname });
              }}
            />
          </>
        );
      },
    },
  ];

  const onUserActivatedChange = useCallback(async (checked: boolean, userId?: string) => {
    try {
      setAdminUserState({ loading: true });
      const { pagination: { current, pageSize }, searchValue } = adminUserState;

      await updateUserForAdmin({ id: userId, activated: checked });
      const usersResult = await userList({ pagination: { current, pageSize }, searchValue });
      const { users, total } = usersResult.data.data;

      setAdminUserState({
        loading: false,
        data: users,
        pagination: {
          ...adminUserState.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setAdminUserState({ loading: false });
    }
  }, [adminUserState, setAdminUserState]);

  const getUserList = useCallback(async (params?: IAdminUserListParams) => {
    try {
      if (!params) {
        params = { pagination: { current: 1, pageSize: 15 }, searchValue: adminUserState.searchValue };
      }

      setAdminUserState({ loading: true });

      const usersResult = await userList(params);
      const { users, total } = usersResult.data.data;

      setAdminUserState({
        loading: false,
        data: users,
        pagination: {
          ...adminUserState.pagination,
          ...params.pagination,
          total,
        },
      });
    } catch (ex) {
      message.error(ex.message);
      setAdminUserState({ loading: false });
    }
  }, [adminUserState, setAdminUserState]);

  const onTableChange = useCallback((
    pagination: TablePaginationConfig,
    filters: Record<string, React.ReactText[] | null>,
    sorter: SorterResult<IUserEntity> | SorterResult<IUserEntity>[],
  ) => {
    const params = { pagination, searchValue: adminUserState.searchValue };
    getUserList(params);
  }, [adminUserState.searchValue, getUserList]);

  const onSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setAdminUserState({ searchValue: event.target.value });
  }, []);

  const onSearch = useCallback(() => {
    if (adminUserState.loading) {
      return;
    }
    getUserList();
  }, [adminUserState.loading, getUserList]);

  const onAvatarChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.avatar = event.target.value;
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onNicknameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.nickname = event.target.value;
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onAccessLevelChange = useCallback((value) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.accessLevel = value;
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onIsBannedChange = useCallback((checked: boolean) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.isBanned = checked;
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onDatePickerOk = useCallback((date: Moment) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.expires = date.toDate().getTime();
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onSignatureChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.signature = event.target.value;
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onPersonalProfileChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUserProfile = Object.assign({}, userEditState.data);
    newUserProfile.personalProfile = event.target.value;
    setUserEditState({ data: newUserProfile });
  }, [userEditState]);

  const onOk = useCallback(async () => {
    try {
      setUserEditState({ loading: true });
      setAdminUserState({ loading: true });
      const { pagination: { current, pageSize }, searchValue } = adminUserState;

      await updateUserForAdmin(userEditState.data as IUserEntity);
      const usersResult = await userList({ pagination: { current, pageSize }, searchValue });
      const { users, total } = usersResult.data.data;

      setUserEditState({ data: null, visible: false, loading: false });
      setAdminUserState({
        loading: false,
        data: users,
        pagination: {
          ...adminUserState.pagination,
          total,
        },
      });

      message.success('保存成功');
    } catch (ex) {
      message.error('保存失败：' + ex.message);
      setUserEditState({ loading: false });
    }
  }, [userEditState, adminUserState]);

  const onCancel = useCallback(() => {
    setUserEditState({ data: null, visible: false });
  }, []);

  const onBroadcastChange = useCallback((checked: boolean) => {
    setUserNotiState({ broadcast: checked });
  }, []);

  const onNotiTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const noti = Object.assign({}, userNotiState.data);
    noti.title = event.target.value;
    setUserNotiState({ data: noti });
  }, [userNotiState]);

  const onNotiDescChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const noti = Object.assign({}, userNotiState.data);
    noti.desc = event.target.value;
    setUserNotiState({ data: noti });
  }, [userNotiState]);

  const onNotiContentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const noti = Object.assign({}, userNotiState.data);
    noti.content = event.target.value;
    setUserNotiState({ data: noti });
  }, [userNotiState]);

  const onNotiOk = useCallback(async () => {
    try {
      setUserNotiState({ loading: true });

      if (!userNotiState.data?.title || !userNotiState.data.content) {
        throw new Error('参数不合法');
      }

      await sendNotification({
        notification: {
          title: userNotiState.data.title,
          desc: userNotiState.data.desc,
          content: userNotiState.data.content,
          userId: userNotiState.data.userId,
        },
        broadcast: userNotiState.broadcast,
      });

      setUserNotiState({ loading: false, visible: false, data: null, username: null });
      message.success('发送成功');
    } catch (ex) {
      message.error('发送失败：' + ex.message);
      setUserNotiState({ loading: false });
    }
  }, [userNotiState]);

  const onNotiCancel = useCallback(() => {
    setUserNotiState({ data: null, visible: false, username: null });
  }, []);

  return (
    <>
      <Breadcrumb className="uranus-admin-breadcrumb">
        <Breadcrumb.Item>用户管理</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 5, minHeight: 360, background: "#fff" }}>
        <Row className="uranus-row">
          <Col span={16} />
          <Col span={8}>
            <div style={{ textAlign: "right", paddingBottom: 8 }}>
              <Input.Search
                placeholder="根据用户名、用户昵称搜索"
                enterButton
                value={adminUserState.searchValue}
                onChange={onSearchChange}
                loading={adminUserState.loading}
                onSearch={onSearch}
              />
            </div>
          </Col>
        </Row>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={adminUserState.data}
          pagination={adminUserState.pagination}
          loading={adminUserState.loading}
          onChange={onTableChange}
        />
        <Modal
          title="编辑用户信息"
          visible={userEditState.visible}
          destroyOnClose
          centered
          confirmLoading={userEditState.loading}
          onOk={onOk}
          onCancel={onCancel}
        >
          <div>
            <Row className="uranus-row">
              <Col span={5}>
                用户昵称：
              </Col>
              <Col span={19}>
                <Input value={userEditState.data?.nickname} onChange={onNicknameChange} />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                用户头像：
              </Col>
              <Col span={19}>
                <Input value={userEditState.data?.avatar} onChange={onAvatarChange} />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                权限等级：
              </Col>
              <Col span={19}>
                <InputNumber value={userEditState.data?.accessLevel} precision={0} onChange={onAccessLevelChange} />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                禁言：
              </Col>
              <Col span={19}>
                <Space>
                  <Switch checked={!!userEditState.data?.isBanned} onChange={onIsBannedChange} />
                  <DatePicker showTime value={userEditState.data?.expires ? moment(userEditState.data?.expires) : null} onOk={onDatePickerOk} />
                </Space>
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                个性签名：
              </Col>
              <Col span={19}>
                <Input
                  placeholder="个性签名，三十个字以内"
                  value={userEditState.data?.signature}
                  onChange={onSignatureChange}
                />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                个人简介：
              </Col>
              <Col span={19}>
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="个人简介，两百个字以内"
                  value={userEditState.data?.personalProfile}
                  onChange={onPersonalProfileChange}
                />
              </Col>
            </Row>
          </div>
        </Modal>
        <Modal
          title="发送通知"
          visible={userNotiState.visible}
          destroyOnClose
          centered
          confirmLoading={userNotiState.loading}
          onOk={onNotiOk}
          onCancel={onNotiCancel}
        >
          <div>
            <Row className="uranus-row">
              <Col span={5}>
                当前用户：
              </Col>
              <Col span={19}>
                <span>{userNotiState.username}</span>
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                标题：
              </Col>
              <Col span={19}>
                <Input value={userNotiState.data?.title} onChange={onNotiTitleChange} />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                备注：
              </Col>
              <Col span={19}>
                <Input value={userNotiState.data?.desc} onChange={onNotiDescChange} />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                内容：
              </Col>
              <Col span={19}>
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  value={userNotiState.data?.content}
                  onChange={onNotiContentChange}
                />
              </Col>
            </Row>
            <Row className="uranus-row">
              <Col span={5}>
                全体广播：
              </Col>
              <Col span={19}>
                <Switch checked={userNotiState.broadcast} onChange={onBroadcastChange} />
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    </>
  );
};