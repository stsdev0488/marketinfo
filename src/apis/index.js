import axios from 'axios';
import { API_URL } from '../configs';

const apiHandler = (requestType, url) => axios({
  baseURL: API_URL,
  url,
  method: requestType,
  headers: { 'Content-Type': 'application/json' },
});

export default apiHandler;
