import axios from 'axios';
import {
  ArticleCategory,
  AuditStatus,
  GoodsType,
  IArticleEntity,
  ICommentInput,
  ICommentListParams,
  INotificationEntity,
  ITagEntity,
  IUserEntity,
  IWebsiteSettingsEntity,
  LikesType,
  PayMethod,
  PayType,
} from '../types';
import { baseURL } from './constant';

const httpClient = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: process.env.NODE_ENV === 'development' ? true : false, // 允许跨域 cookie
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
});

httpClient.interceptors.response.use(result => {
  if (result.data.code !== 200) {
    throw new Error(result.data.message);
  } else {
    return result;
  }
});

// user
export const userStatus = () => {
  return httpClient({
    method: 'GET',
    url: '/api/user/status',
  });
};

export const userSearch = (params: { pagination: { current?: number, pageSize?: number }, searchValue?: string }) => {
  const query: string[] = [];
  const { pagination: { current, pageSize }, searchValue } = params;

  if (current) {
    query.push(`current=${current}`);
  }
  if (pageSize) {
    query.push(`pageSize=${pageSize}`);
  }
  if (searchValue) {
    query.push(`searchValue=${searchValue}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/user/search' + (queryString ? '?' + queryString : ''),
  });
};

export const userList = (params: { pagination: { current?: number, pageSize?: number }, searchValue?: string }) => {
  const query: string[] = [];
  const { pagination: { current, pageSize }, searchValue } = params;

  if (current) {
    query.push(`current=${current}`);
  }
  if (pageSize) {
    query.push(`pageSize=${pageSize}`);
  }
  if (searchValue) {
    query.push(`searchValue=${searchValue}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/user/admin/userList' + (queryString ? '?' + queryString : ''),
  });
};

export const updateUserProfile = (data: IUserEntity) => {
  return httpClient({
    method: 'POST',
    url: '/api/user/updateUserProfile',
    data,
  });
};

export const updateUserForAdmin = (data: Partial<IUserEntity>) => {
  return httpClient({
    method: 'POST',
    url: '/api/user/updateUserForAdmin',
    data,
  });
};

export const sendSms = (data: { phoneNumber: string }) => {
  return httpClient({
    method: 'POST',
    url: '/api/user/getSmsCode',
    data,
  });
};

export const signUp = (data: {
  username: string,
  password: string,
  smsCode: string,
}) => {
  return httpClient({
    method: 'POST',
    url: 'api/user/signUp',
    data,
  });
};

export const signIn = (data: {
  username: string,
  password: string,
}) => {
  return httpClient({
    method: 'POST',
    url: 'api/user/signIn',
    data,
  });
};

export const signOut = () => {
  return httpClient({
    method: 'DELETE',
    url: 'api/user/signOut',
  });
};

export const resetPassword = (data: {
  username: string,
  password: string,
  smsCode: string,
}) => {
  return httpClient({
    method: 'POST',
    url: 'api/user/resetPassword',
    data,
  });
};

// tag
export const tagList = () => {
  return httpClient({
    method: 'GET',
    url: '/api/tag/tagList',
  });
};

export const tagSave = (data: ITagEntity) => {
  return httpClient({
    method: 'POST',
    url: '/api/tag/tagSave',
    data,
  });
};

export const tagDelete = (data: { id: string }) => {
  return httpClient({
    method: 'DELETE',
    url: '/api/tag/tagDelete',
    data,
  });
};

// sts
export const stsAuth = () => {
  return httpClient({
    method: 'GET',
    url: '/api/sts/stsAuth',
  });
};

export const stsAuthForForm = (filename: string) => {
  return httpClient({
    method: 'GET',
    url: '/api/sts/stsAuthForForm?filename=' + filename,
  });
};

// settings
export const websiteSettingsUpdate = (data: IWebsiteSettingsEntity) => {
  return httpClient({
    method: 'POST',
    url: '/api/websiteSettings/update',
    data,
  });
};

export const websiteSettingsShow = () => {
  return httpClient({
    method: 'GET',
    url: '/api/websiteSettings/show',
  });
};

export const websiteMotto = () => {
  return httpClient({
    method: 'GET',
    url: '/api/websiteSettings/motto',
  });
};

export const websiteAdvertisement = () => {
  return httpClient({
    method: 'GET',
    url: '/api/websiteSettings/advertisement',
  });
};

export const notificationCount = () => {
  return httpClient({
    method: 'GET',
    url: '/api/notification/notificationCount',
  });
};

export const notificationList = (lastNotiId?: string) => {
  return httpClient({
    method: 'GET',
    url: `/api/notification/notificationList${lastNotiId ? '?lastNotiId=' + lastNotiId : ''}`,
  });
};

export const notificationAll = (lastNotiId?: string) => {
  return httpClient({
    method: 'GET',
    url: `/api/notification/notificationAll${lastNotiId ? '?lastNotiId=' + lastNotiId : ''}`,
  });
};

export const markAsRead = (data: INotificationEntity) => {
  return httpClient({
    method: 'POST',
    url: '/api/notification/markAsRead',
    data,
  });
};

export const markAsReadForAll = () => {
  return httpClient({
    method: 'POST',
    url: '/api/notification/markAsReadForAll',
  });
};

export const sendNotification = (data: { notification: INotificationEntity, broadcast: boolean }) => {
  return httpClient({
    method: 'POST',
    url: '/api/notification/sendNotification',
    data,
  });
};

// article
export const articleGet = (articleId: string) => {
  return httpClient({
    method: 'GET',
    url: `/api/article/get?articleId=${articleId}`,
  });
};

export const articleActionDataGet = (articleId: string) => {
  return httpClient({
    method: 'GET',
    url: `/api/article/actionDataGet?articleId=${articleId}`,
  });
};

export const articleList = (params: { category: ArticleCategory, pagination: { current?: number, pageSize?: number }, searchValue?: string }) => {
  const query: string[] = [];
  const { category, pagination: { current, pageSize }, searchValue } = params;

  query.push(`category=${category}`);

  if (current) {
    query.push(`current=${current}`);
  }
  if (pageSize) {
    query.push(`pageSize=${pageSize}`);
  }
  if (searchValue) {
    query.push(`searchValue=${searchValue}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/article/list' + (queryString ? '?' + queryString : ''),
  });
};

export const articleListForAdmin = (params: { pagination: { current?: number, pageSize?: number }, searchValue?: string }) => {
  const query: string[] = [];
  const { pagination: { current, pageSize }, searchValue } = params;

  if (current) {
    query.push(`current=${current}`);
  }
  if (pageSize) {
    query.push(`pageSize=${pageSize}`);
  }
  if (searchValue) {
    query.push(`searchValue=${searchValue}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/article/admin/list' + (queryString ? '?' + queryString : ''),
  });
};

export const articleAudit = (data: { articleId: string, auditStatus: AuditStatus }) => {
  return httpClient({
    method: 'POST',
    url: '/api/article/admin/audit',
    data,
  });
};

export const articleDeleteForAdmin = (data: { articleId: string }) => {
  return httpClient({
    method: 'DELETE',
    url: '/api/article/admin/delete',
    data,
  });
};

export const articleSave = (data: IArticleEntity) => {
  return httpClient({
    method: 'POST',
    url: '/api/article/save',
    data,
  });
};

export const commentSubmit = (data: ICommentInput) => {
  return httpClient({
    method: 'POST',
    url: '/api/comment/submit',
    data,
  });
};

export const commentDelete = (data: { commentId: string }) => {
  return httpClient({
    method: 'DELETE',
    url: '/api/comment/delete',
    data,
  });
};

export const commentList = (params: ICommentListParams) => {
  const query: string[] = [];
  const { commentType, targetId, parentId, lastCommentId } = params;

  query.push(`commentType=${commentType}`);
  query.push(`targetId=${targetId}`);
  query.push(`parentId=${parentId}`);

  if (lastCommentId) {
    query.push(`lastCommentId=${lastCommentId}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/comment/list?' + queryString,
  });
};

export const commentListForAdmin = (params: { pagination: { current?: number, pageSize?: number }, searchValue?: string }) => {
  const query: string[] = [];
  const { pagination: { current, pageSize }, searchValue } = params;

  if (current) {
    query.push(`current=${current}`);
  }
  if (pageSize) {
    query.push(`pageSize=${pageSize}`);
  }
  if (searchValue) {
    query.push(`searchValue=${searchValue}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/comment/admin/list' + (queryString ? '?' + queryString : ''),
  });
};

export const commentAudit = (data: { commentId: string, passed: boolean }) => {
  return httpClient({
    method: 'POST',
    url: '/api/comment/admin/audit',
    data,
  });
};

export const commentDeleteForAdmin = (data: { commentId: string }) => {
  return httpClient({
    method: 'DELETE',
    url: '/api/comment/admin/delete',
    data,
  });
};

export const likesSubmit = (data: { likesType: LikesType, targetId: string }) => {
  return httpClient({
    method: 'POST',
    url: '/api/likes/like',
    data,
  });
};

export const likesCancel = (data: { likesType: LikesType, targetId: string }) => {
  return httpClient({
    method: 'DELETE',
    url: '/api/likes/cancel',
    data,
  });
};

export const messageCount = () => {
  return httpClient({
    method: 'GET',
    url: '/api/message/count',
  });
};

export const messageList = (params: { lastMessageId?: string }) => {
  return httpClient({
    method: 'GET',
    url: '/api/message/list' + (params.lastMessageId ? `?lastMessageId=${params.lastMessageId}` : ''),
  });
};

export const messageSubmit = (data: { message: string }) => {
  return httpClient({
    method: 'POST',
    url: '/api/message/submit',
    data,
  });
};

export const messageListForAdmin = (params: { pagination: { current?: number, pageSize?: number }, searchValue?: string }) => {
  const query: string[] = [];
  const { pagination: { current, pageSize }, searchValue } = params;

  if (current) {
    query.push(`current=${current}`);
  }
  if (pageSize) {
    query.push(`pageSize=${pageSize}`);
  }
  if (searchValue) {
    query.push(`searchValue=${searchValue}`);
  }

  const queryString = query.join('&');

  return httpClient({
    method: 'GET',
    url: '/api/message/admin/list' + (queryString ? '?' + queryString : ''),
  });
};

export const messageDeleteForAdmin = (data: { messageId: string }) => {
  return httpClient({
    method: 'DELETE',
    url: '/api/message/admin/delete',
    data,
  });
};

export const generateOrder = (data: { goodsType: GoodsType, goodsId: string }) => {
  return httpClient({
    method: 'POST',
    url: '/api/order/generateOrder',
    data,
  });
};

export const initPay = (data: { orderId: string, payType: PayType, payMethod: PayMethod }) => {
  return httpClient({
    method: 'POST',
    url: '/api/pay/initPay',
    data,
  });
};

export const githubOAuth = (code: string) => {
  return httpClient({
    method: 'GET',
    url: '/api/oauth/github?code=' + code,
    timeout: 12000,
  });
};