import axios from "axios";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
export const http = axios.create({
  baseURL: 'http://localhost:7200/',
  headers: {
    'X-GraphDB-Repository': 'TCC',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});