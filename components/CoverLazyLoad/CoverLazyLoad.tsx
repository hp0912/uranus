import React, { FC } from 'react';
import LazyLoad from 'react-lazyload';
import Link from 'next/link';

// 样式
import styles from "../components.module.css";

interface ICoverLazyLoadProps {
  articleId?: string;
  coverURL: string;
}

export const CoverLazyLoad: FC<ICoverLazyLoadProps> = (props) => {
  const { articleId, coverURL } = props;

  return (
    <LazyLoad height={250} offset={100}>
      <div className={styles.uranus_article_image_container}>
        <div className={styles.uranus_article_image_sub}>
          {
            articleId ?
              (
                <Link href={`/article/detail/${articleId}`}>
                  <div className={styles.uranus_article_image} style={{ backgroundImage: `url(${coverURL})` }} />
                </Link>
              ) :
              <div className={styles.uranus_article_image} style={{ backgroundImage: `url(${coverURL})` }} />
          }
        </div>
      </div>
    </LazyLoad>
  );
};