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
  id?: string;
  username: string;
  nickname: string;
  avatar: string;
  accessLevel: number;
  signature?: string;
  personalProfile?: string;
  activated?: boolean;
  registerTime?: number;
}

export interface ISTSAuthResult {
  SecurityToken: string;
  AccessKeyId: string;
  AccessKeySecret: string;
  Policy: string;
  Expiration: string;
}

export interface ISTSAuthForFormResult {
  OSSAccessKeyId: string;
  policy: string;
  Signature: string;
}

export interface ITagEntity {
  id?: string;
  name?: string;
  color?: string;
  index?: number;
}