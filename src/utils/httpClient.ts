import axios from 'axios';
import { ITagEntity, IUserEntity } from '../types';

const baseURL = 'http://localhost:9000';
const httpClient = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true, // 允许跨域 cookie
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