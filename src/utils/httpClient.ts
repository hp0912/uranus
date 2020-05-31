import axios from 'axios';

const baseURL = '';
const httpClient = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true, // 允许跨域 cookie
  headers: {'X-Requested-With': 'XMLHttpRequest'}
});

export const sendSms = (data: { phoneNum: string }) => {
  return httpClient({
    method: 'POST', 
    url: 'api/user/sendSms', 
    data,
  });
};

export const signUp = (data: {
  username: string,
  password: string,
  sms: string,
}) => {
  return httpClient({
    method: 'POST', 
    url: 'api/user/signUp', 
    data,
  });
};