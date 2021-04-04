import { DownOutlined, LogoutOutlined, NotificationOutlined, RobotOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Menu, message, Modal, Tooltip } from 'antd';
import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { SETUSER, UserContext } from '../../store/user';
import { notificationCount, signOut } from '../../utils/httpClient';
import { UserNotification } from './UserNotification';
import { WriteIcon } from './WriteIcon';

// 样式
import headerStyles from './header.module.css';
import avatarStyles from '../UranusAvatar/avatar.module.css';
import { AdminMenuKey } from '../Admin';

const bodyStyle = {
  padding: '6px 8px 10px 8px',
};

interface IUserAvatarProps {
  isBackend: boolean;
  avatarColor: string;
  avatarSize: number;
}

const UserAvatar: FC<IUserAvatarProps> = (props) => {
  const userContext = useContext(UserContext);
  const router = useRouter();

  const [menuDisabled, setMenuDisabled] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [notiVisible, setNotiVisible] = useState(false);

  useEffect(() => {
    notificationCount().then((result) => {
      setNotifications(result.data.data);
    }).catch((reason) => {
      console.error(reason);
    });

    const timer = setInterval(() => {
      notificationCount().then((result) => {
        setNotifications(result.data.data);
      }).catch((reason) => {
        console.error(reason);
      });
    }, 10000);

    return () => { clearInterval(timer); };
  }, []);

  const onArticleEditClick = useCallback(() => {
    router.push('/article/edit/new');
  }, [router]);

  const onUserSettingClick = useCallback(() => {
    router.push('/user/settings');
  }, [router]);

  const onUserHomePagesClick = useCallback(() => {
    router.push('/user/homepages');
  }, [router]);

  const onNotificationClick = useCallback(() => {
    setNotiVisible(true);
  }, []);

  const onCancel = useCallback(() => {
    setNotiVisible(false);
  }, []);

  const onBackManageClick = useCallback(() => {
    router.push(`/admin/${AdminMenuKey.article_management}`);
  }, [router]);

  const onGoBackFrontendClick = useCallback(() => {
    router.push('/frontend');
  }, [router]);

  const onSingOutClick = useCallback(async () => {
    try {
      setMenuDisabled(true);
      await signOut();

      setMenuDisabled(false);
      message.success('退出登录');

      if (userContext.userDispatch) {
        userContext.userDispatch({ type: SETUSER, data: null });
      }
    } catch (ex) {
      Modal.error({
        title: '错误',
        content: ex.message,
      });
      setMenuDisabled(false);
    }
  }, [userContext]);

  const UserMenu = (
    <Menu theme="light">
      <Menu.Item key="userSettings">
        <span onClick={onUserSettingClick} >
          <SettingOutlined /> 个人设置
        </span>
      </Menu.Item>
      <Menu.Item key="userHomePages">
        <span onClick={onUserHomePagesClick} >
          <UserOutlined /> 我的主页
        </span>
      </Menu.Item>
      <Menu.Item key="notification">
        <span onClick={onNotificationClick} >
          <NotificationOutlined /> 系统通知
          {
            notifications ?
              <> [<span style={{ color: 'red' }}>{notifications}</span>]</> :
              null
          }
        </span>
      </Menu.Item>
      {
        userContext.userState && userContext.userState?.accessLevel > 5 && !props.isBackend &&
        (
          <Menu.Item key="backManage">
            <span onClick={onBackManageClick} >
              <RobotOutlined /> 后台管理
            </span>
          </Menu.Item>
        )
      }
      {
        props.isBackend &&
        (
          <Menu.Item key="goBackFrontend">
            <span onClick={onGoBackFrontendClick} >
              <RobotOutlined /> 返回前台
            </span>
          </Menu.Item>
        )
      }
      <Menu.Item key="signOut">
        <span onClick={onSingOutClick} >
          <LogoutOutlined /> 退出
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={props.isBackend ? headerStyles.uranus_user_avatar_backend : headerStyles.uranus_user_avatar_frontend}>
      {
        !props.isBackend &&
        (
          <Tooltip className={headerStyles.uranus_article_edit} title="写博客">
            <WriteIcon onClick={onArticleEditClick} />
          </Tooltip>
        )
      }
      <Dropdown
        placement="bottomRight"
        trigger={['click']}
        disabled={menuDisabled}
        overlay={UserMenu}
      >
        <span style={{ color: props.avatarColor, cursor: 'pointer' }} onClick={e => e.preventDefault()}>
          <Badge count={notifications ? <div className={headerStyles.uranus_badge}>{notifications}</div> : 0}>
            <Avatar className={avatarStyles['uranus-avatar-image']} size={props.avatarSize} src={userContext.userState?.avatar} />
          </Badge>
          <span className={headerStyles.uranus_nickname} style={{ paddingLeft: 8, paddingRight: 8 }}>
            {
              userContext.userState && userContext.userState.nickname.length > 11 ?
                userContext.userState.nickname.substr(0, 8) + '...' :
                userContext.userState?.nickname
            }
          </span>
          <DownOutlined />
        </span>
      </Dropdown>
      <Modal
        title="通知"
        bodyStyle={bodyStyle}
        visible={notiVisible}
        destroyOnClose
        centered
        footer={null}
        onCancel={onCancel}
      >
        <UserNotification />
      </Modal>
    </div>
  );
};

export default UserAvatar;
