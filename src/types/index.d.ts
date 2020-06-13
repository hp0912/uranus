export interface IArticleEntity {
  id: number;
  title: string;
  coverPicture?: string;
  desc?: string;
  content?: string;
  tags?: number[];
  auditStatus: number;
  createdBy: number;
  createdTime: number;
  modifyTime: number;
}

export interface IUserEntity {
  username: string;
  nickname: string;
  avatar: string;
  accessLevel: number;
}

export interface ITagEntity {
  id?: string;
  name?: string;
  color?: string;
  index?: number;
}