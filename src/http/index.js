import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const instance = axios.create({
  baseURL: `http://${process.env.REACT_APP_SERVER_IP}:8080`,
});

export default instance;
