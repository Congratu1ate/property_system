import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端接口地址
  timeout: 5000,
});

export default instance;
