import axios from 'axios';

const baseURL = 'http://localhost:9000';
const httpClient = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true, // 允许跨域 cookie
  headers: {'X-Requested-With': 'XMLHttpRequest'}
});

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
  sms: string,
}) => {
  return httpClient({
    method: 'POST', 
    url: 'api/user/signUp', 
    data,
  });
};