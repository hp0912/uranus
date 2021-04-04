import { IArticleEntity } from '../types';

export const UPDATEARTICLE = 'UPDATEARTICLE';

export const reducer = (state: IArticleEntity | null, action: { type: string, data: IArticleEntity | null }) => {
  switch (action.type) {
    case UPDATEARTICLE:
      if (action.data) {
        return Object.assign({}, state, action.data);
      } else {
        return null;
      }
    default:
      return null;
  }
};