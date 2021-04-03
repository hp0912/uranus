import { BackTop } from 'antd';
import React, { FC } from 'react';

// 样式
import styles from './uranusFooter.module.css';

export const UranusFooter: FC = (props) => {

  return (
    <div>
      <div className={styles.uranus_footer}>
        <span className={styles.uranus_footer_item}>关于吼吼</span>
        <span className={styles.uranus_footer_item}>意见反馈</span>
        <span className={styles.uranus_footer_item}>帮助中心</span>
        <span className={styles.uranus_footer_item}>©3020 Houhou </span>
        <span className={styles.uranus_footer_item}>粤ICP备20050348号</span>
      </div>
      <BackTop />
    </div>
  );
};