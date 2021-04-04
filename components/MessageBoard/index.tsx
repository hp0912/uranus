import { AudioOutlined } from '@ant-design/icons';
import { Input, message, Modal } from 'antd';
import Barrage from 'barrage-ui';
import React, { FC, useCallback, useEffect, useRef } from 'react';
import { IMessageEntity } from '../../types';
import { useSetState } from '../../utils/commonHooks';
import { messageCount, messageList, messageSubmit } from '../../utils/httpClient';

// 样式
import styles from './messageBoard.module.css';

interface IBarrageEntity {
  key: string;
  createdAt: string;
  time: number;
  text: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  avatar?: string;
  avatarSize?: number;
  avatarMarginRight?: number;
}

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);

const MessageBoard: FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const barrageRef = useRef<any>(null);
  const messagesRef = useRef<IBarrageEntity[]>([]);
  const timeRef = useRef(Date.now());

  const [messageState, setMessageState] = useSetState({ message: '', loading: false });

  const message2Barrage = (msg: IMessageEntity, timeOffset?: number) => {
    return {
      key: msg.id!,
      createdAt: new Date(msg.addtime!).toISOString(),
      time: timeOffset ? timeOffset + (msg.addtime! % 20000) : msg.addtime! % 20000,
      text: msg.content!,
      color: `#${(4095 - msg.userAccessLevel! * 300).toString(16)}`,
      avatar: msg.userAvatar,
    };
  };

  useEffect(() => {
    const barrage = new Barrage({
      container: container.current, // 父级容器
      data: [], // 弹幕数据
      config: {
        // 全局配置项
        duration: 20000, // 弹幕循环周期(单位：毫秒)
        defaultColor: '#fff', // 弹幕默认颜色
      },
      avoidOverlap: false,
    });

    // 播放弹幕
    barrage.play();
    barrageRef.current = barrage;

    const messageCurrent: IBarrageEntity[] = [];

    Promise.all([
      messageCount(),
      messageList({}),
    ]).then(([countResult, messageResult]) => {
      const count = countResult.data.data;
      const messages: IMessageEntity[] = messageResult.data.data;

      if (count > 0) {
        messageCurrent.push({
          key: '0000000000000000',
          createdAt: new Date().toISOString(),
          time: 1000,
          text: `${count}条弹幕来袭，大家做好准备...`,
        });

        messages.forEach((msg) => {
          messageCurrent.push(message2Barrage(msg));
        });

        messagesRef.current = messageCurrent;
        barrage.setData(messageCurrent.slice());
      }
    }).catch(reason => {
      Modal.error({ title: '获取留言失败', content: reason.message });
    });

    const timer = setInterval(() => {
      messageList({ lastMessageId: messagesRef.current.length ? messagesRef.current[messagesRef.current.length - 1].key : undefined }).then(messageResult => {
        const messages: IMessageEntity[] = messageResult.data.data;
        const now = Date.now();

        if (messages.length > 0) {
          barrage.setConfig({ duration: -1 });

          messages.forEach(msg => {
            const bar = message2Barrage(msg, now - timeRef.current > 20000 ? now - timeRef.current - 20000 : now - timeRef.current);
            barrage.add(bar);
            messagesRef.current.push(bar);
          });
        } else {
          barrage.setConfig({ duration: 20000 });
        }
      }).catch(reason => {
        message.error(reason.message);
      });
    }, 19000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const onMessageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageState({ message: event.target.value });
  }, [setMessageState]);

  const onMessageSubmit = useCallback(async (value: string) => {
    try {
      setMessageState({ loading: true });

      const result = await messageSubmit({ message: value });
      const msg = result.data.data;
      const now = Date.now();

      if (barrageRef.current) {
        const bar = message2Barrage(msg, now - timeRef.current);
        bar.key = bar.key + now;
        barrageRef.current.add(bar);
      }

      setMessageState({ loading: false, message: '' });
    } catch (ex) {
      message.error(ex.message);
      setMessageState({ loading: false });
    }
  }, [setMessageState]);

  return (
    <>
      <div className={styles.uranus_message_container} ref={container} />
      <div className={styles.message_submit}>
        <Search
          placeholder="请输入留言..."
          enterButton="发送留言"
          size="large"
          suffix={suffix}
          value={messageState.message}
          onChange={onMessageChange}
          onSearch={onMessageSubmit}
        />
      </div>
    </>
  );
};

export default MessageBoard;