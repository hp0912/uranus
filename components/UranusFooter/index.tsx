import { BackTop } from "antd";
import React, { FC } from "react";

// 样式
import styles from "./uranusFooter.module.css";
import "aplayer/dist/APlayer.min.css";

export const UranusFooter: FC = (props) => {

  return (
    <div>
      <div className={styles.uranusFooter}>
        <span className={styles.uranusFooterItem}>关于吼吼</span>
        <span className={styles.uranusFooterItem}>意见反馈</span>
        <span className={styles.uranusFooterItem}>帮助中心</span>
        <span className={styles.uranusFooterItem}>©3020 Houhou </span>
        <span className={styles.uranusFooterItem}>粤ICP备20050348号</span>
      </div>
      <BackTop />
    </div>
  );
};