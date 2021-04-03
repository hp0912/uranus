import React from 'react';

// 样式
import styles from './pageLoading.module.css';

export const PageLoading = () => {
  return (
    <div className={styles.uranus_page_loading}>
      <div className={styles.loader}>
        <div className={styles.text}>Loading...</div>
        <div className={styles.horizontal}>
          <div className={styles.circlesup}>
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
          </div>
          <div className={styles.circlesdwn}>
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
          </div>
        </div>
        <div className={styles.vertical}>
          <div className={styles.circlesup}>
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
          </div>
          <div className={styles.circlesdwn}>
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
            <div className={styles.circle} />
          </div>
        </div>
      </div>
    </div>
  );
};