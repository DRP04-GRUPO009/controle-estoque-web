import axios from 'axios';
import { AuthRequest } from '../interfaces/models/AuthRequest';
import { AuthResponse } from '../interfaces/models/AuthResponse';

const BASE_URL = 'http://controleestoque.pythonanywhere.com/token/';

export const getToken = async (userData: AuthRequest): Promise<AuthResponse | undefined> => {
  try {
    const response = await axios.post<AuthResponse>(`${BASE_URL}`, userData);
    return response.data;
  } catch (error) {
    error;
  }

  return;
};

export const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}refresh/`, { 'refresh' : refreshToken });
  return response.data;
}

export const validateAccessToken = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${BASE_URL}verify/`, { 'token': accessToken });
    if (response.status == 200) return true;
    else return false;
  } catch (error) {
    error;
  }
  
  return false;
}
