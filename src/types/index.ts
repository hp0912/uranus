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
  tags?: string[];
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
  isBanned?: boolean;
  expires?: number;
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

export enum GoodsType {
  article = 'article',
}

export enum OrderCode {
  init = 0,
  success = 200,
  failure = 500,
}

export enum PayType {
  AliPay = '1',
  WeChatPay = '2',
}

export enum PayMethod {
  scan = 'scan',
  wap = 'wap',
  cashier = 'cashier',
}

export interface IOrderEntity {
  _id?: string;
  id?: string;
  goodsType?: GoodsType;
  goodsId?: string;
  totalPrice?: number;
  userId?: string;
  remark?: string;
  code?: OrderCode;
  status?: string;
  createTime: number;
}

export enum CommentType {
  article = 'article',
}

export interface ICommentEntity {
  _id?: string;
  id?: string;
  commentType?: CommentType;
  targetId?: string;
  parentId?: string;
  userId?: string;
  userNicname?: string;
  userAvatar?: string;
  userAccessLevel?: number;
  content?: string;
  passed?: boolean;
  addtime?: number;
  children?: ICommentEntity[];
}

export enum IUranusNodeType {
  div = 'div',
  img = 'img',
  span = 'span',
  text = 'text',
  br = 'br',
}

export interface IUranusNode {
  nodeType: IUranusNodeType;
  data?: string;
  attr?: {
    src?: string;
    'data-id'?: string;
    'data-code'?: string;
  };
}

export interface ICommentInput {
  commentType: CommentType;
  targetId: string;
  parentId: string;
  content: { rows: IUranusNode[][] };
}

export interface ICommentListParams {
  commentType: CommentType;
  targetId: string;
  parentId: string;
  lastCommentId?: string;
}

export enum LikesType {
  article = 'article',
}
