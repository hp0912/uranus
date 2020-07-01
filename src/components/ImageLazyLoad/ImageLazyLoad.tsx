import React, { FC } from 'react';
import LazyLoad from 'react-lazyload';
import { Link } from "react-router-dom";

interface IImageLazyLoadProps {
  articleId: string;
  coverURL: string;
}

export const ImageLazyLoad: FC<IImageLazyLoadProps> = (props) => {
  const { articleId, coverURL } = props;

  return (
    <LazyLoad height={250} offset={100}>
      <div className="uranus-article-image-container">
        <div className="uranus-article-image-sub">
          <Link to={`/articledetail/${articleId}`}>
            <div className="uranus-article-image" style={{ backgroundImage: `url(${coverURL})` }} />
          </Link>
        </div>
      </div>
    </LazyLoad>
  );
};