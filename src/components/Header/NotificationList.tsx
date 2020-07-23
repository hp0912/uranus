import { CheckCircleOutlined, EyeOutlined, LockOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, List, message, Popover, Row, Skeleton, Tooltip } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { INotificationEntity } from '../../types';
import { markAsRead, markAsReadForAll } from '../../utils/httpClient';

// 样式
import '../UranusComment/commentEditor.css';

const count = 3;

interface INotificationListProps {
  type: 'hasnotread' | 'all';
  getData: (lastNotiId?: string) => Promise<{ data: { data: INotificationEntity[] } }>;
}

interface INotification extends INotificationEntity {
  loading?: boolean;
}

export const NotificationList: FC<INotificationListProps> = (props) => {
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<INotification[]>([]);
  const [list, setList] = useState<INotification[]>([]);

  useEffect(() => {
    props.getData().then(result => {
      setInitLoading(false);
      setData(result.data.data);
      setList(result.data.data);
    }).catch(reason => {
      setInitLoading(false);
    });
  }, []);

  useEffect(() => {
    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    // In real scene, you can using public method of react-virtualized:
    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    window.dispatchEvent(new Event('resize'));
  }, [list]);

  const onLoadMore = useCallback(async () => {
    setLoading(true);
    setList(data.concat([...new Array(count)].map(() => ({ loading: true }))));

    const result = await props.getData(data.length ? data[data.length - 1].id : undefined);
    const newData = data.concat(result.data.data);

    if (result.data.data.length === 0) {
      message.info('没有更多数据了');
    }

    setLoading(false);
    setData(newData);
    setList(newData);
  }, [data, list]);

  const onMarkAsReadClick = useCallback(async (noti: INotificationEntity) => {
    try {
      setInitLoading(true);
      setLoading(true);

      await markAsRead(noti);

      const newData = data.filter(item => item.id !== noti.id);

      setInitLoading(false);
      setLoading(false);
      setData(newData);
      setList(newData);
    } catch (ex) {
      setInitLoading(false);
      setLoading(false);
      message.error(ex.message);
    }
  }, [data]);

  const onAllMarkAsReadClick = useCallback(async () => {
    try {
      setInitLoading(true);
      setLoading(true);

      await markAsReadForAll();

      setInitLoading(false);
      setLoading(false);
      setData([]);
      setList([]);
    } catch (ex) {
      setInitLoading(false);
      setLoading(false);
      message.error(ex.message);
    }
  }, []);

  const loadMore = !initLoading && !loading ? <Button type="primary" block onClick={onLoadMore}>加载更多</Button> : null;

  return (
    <div>
      {
        props.type === "hasnotread" ?
          (
            <Row className="uranus-notification-top">
              <Col span={16} />
              <Col span={8} className="uranus-notification-top-01">
                <Button
                  type="link"
                  onClick={onAllMarkAsReadClick}
                >
                  全部标记为已读
                </Button>
              </Col>
            </Row>
          ) :
          null
      }
      <List
        className="uranus-notification-list"
        loading={initLoading}
        itemLayout="horizontal"
        loadMore={loadMore}
        dataSource={list}
        renderItem={item => (
          <List.Item
            actions={[
              (
                <Popover
                  placement="top"
                  content={<div className="uranus-comment-container" dangerouslySetInnerHTML={{ __html: item.content as string }} />}
                  title={item.title}
                  trigger="click"
                >
                  <EyeOutlined />
                </Popover>
              ),
              props.type === "hasnotread" ?
                (
                  <Tooltip key="markAsRead" title="标记为已读">
                    <CheckCircleOutlined onClick={() => { onMarkAsReadClick(item); }} />
                  </Tooltip>
                ) :
                <LockOutlined />,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={
                  <Avatar>Admin</Avatar>
                }
                title={<b>{item.title}</b>}
                description="系统通知"
              />
              <div>
                {
                  item.content && item.content.length > 15 ?
                    item.content.substr(0, 15) + "..." :
                    item.content
                }
              </div>
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
};