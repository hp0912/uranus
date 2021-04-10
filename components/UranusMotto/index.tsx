import { message } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { websiteMotto } from '../../utils/httpClient';

// 样式
import componentStyles from '../components.module.css';
import styles from './uranusMotto.module.css';

export const UranusMotto: FC = () => {
  const [motto, setMotto] = useState(() => {
    return `
      <p class="uranus-motto-item">楼道角落里阳光每天盛开</p>
      <p class="uranus-motto-item">你很久前也在</p>
      <p class="uranus-motto-item">很久前的花肥肥地开在窗外</p>
      <p class="uranus-motto-item">你很久前也毛茸茸地在窗里开</p>
      <p class="uranus-motto-item">它们为什么能长盛不衰</p>
      <p class="uranus-motto-item">我们为什么屡战屡败</p>
      <p class="uranus-motto-item">——冯唐《记梦》</p>
    `;
  });

  useEffect(() => {
    websiteMotto().then(result => {
      const m = result.data.data;
      if (m) {
        setMotto(result.data.data);
      }
    }).catch((reason) => {
      message.error(reason.message);
    });
  }, []);

  return (
    <div className={componentStyles.uranus_card}>
      <div className={styles.uranus_motto} dangerouslySetInnerHTML={{ __html: motto }} />
    </div>
  );
};