import axios from "axios";

const Instance = axios.create({
  baseURL: 'http://192.168.1.77:3000',
  timeout : 5000,
});
Instance.interceptors.request.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default Instance;
