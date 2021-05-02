import { BackTop } from 'antd';
import React, { FC } from 'react';

const styles = {
  uranus_footer: {
    width: '100%',
    zIndex: 302,
    height: '40px',
    overflow: 'hidden',
    color: '#999',
    zoom: 1,
    margin: 0,
    backgroundColor: '#000',
    textAlign: 'center',
    lineHeight: '40px',
  } as React.CSSProperties,
  uranus_footer_item: {
    marginLeft: '10px',
    marginRight: '10px',
    font: '12px arial',
  }
};

export const UranusFooter: FC = () => {

  return (
    <div>
      <div style={styles.uranus_footer}>
        <span style={styles.uranus_footer_item}>关于吼吼</span>
        <span style={styles.uranus_footer_item}>意见反馈</span>
        <span style={styles.uranus_footer_item}>帮助中心</span>
        <span style={styles.uranus_footer_item}><a href="/daxigua">DIY合成大西瓜</a></span>
        <span style={styles.uranus_footer_item}>©3020 Houhou </span>
        <span style={styles.uranus_footer_item}>粤ICP备20050348号</span>
      </div>
      <BackTop />
    </div>
  );
};