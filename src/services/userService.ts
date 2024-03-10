import axios from "axios";
import { User } from "../interfaces/models/User";

const BASE_URL = 'http://127.0.0.1:8000/api/Usuarios'

export const register = async (userData: User, accessToken: string): Promise<User> => {
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    }
    const response = await axios.post<User>(`${BASE_URL}`, userData, config);
    return response.data;
};
  