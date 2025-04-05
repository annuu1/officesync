import axios from 'axios';
import { API_URL } from '../constants';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/upload`, formData);
};

export const fetchMessages = async () => {
  return axios.get(`${API_URL}/messages`);
};