export enum ShareWith {
  private = 'private',
  public = 'public',
}

export enum AuditStatus {
  approved = 'approved',
  unapprove = 'unapprove',
}

export interface IArticleEntity {
  id?: string;
  title?: string;
  coverPicture?: string;
  desc?: string;
  content?: string;
  tags?: number[];
  charge?: boolean;
  amount?: number;
  shareWith?: ShareWith;
  auditStatus?: AuditStatus;
  createdBy?: string;
  createdTime?: number;
  modifyBy?: string;
  modifyTime?: number;
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

export interface IWebsiteSettingsEntity {
  _id?: string;
  id?: string;
  motto?: string;
  advertisement?: string;
  commentReview?: boolean;
  messageReview?: boolean;
}

export interface INotificationEntity {
  _id?: string;
  id?: string;
  title?: string;
  desc?: string;
  content?: string;
  userId?: string;
  time?: number;
  hasRead?: boolean;
}
