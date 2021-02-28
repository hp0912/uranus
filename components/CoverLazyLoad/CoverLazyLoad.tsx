import React, { FC } from 'react';
import LazyLoad from 'react-lazyload';
import { Link } from "react-router-dom";

interface ICoverLazyLoadProps {
  articleId?: string;
  coverURL: string;
}

export const CoverLazyLoad: FC<ICoverLazyLoadProps> = (props) => {
  const { articleId, coverURL } = props;

  return (
    <LazyLoad height={250} offset={100}>
      <div className="uranus-article-image-container">
        <div className="uranus-article-image-sub">
          {
            articleId ?
              (
                <Link to={`/article/detail/${articleId}`}>
                  <div className="uranus-article-image" style={{ backgroundImage: `url(${coverURL})` }} />
                </Link>
              ) :
              <div className="uranus-article-image" style={{ backgroundImage: `url(${coverURL})` }} />
          }
        </div>
      </div>
    </LazyLoad>
  );
};