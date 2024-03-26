import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { StockItemFormInputs } from '../pages/EditStock';

const BASE_URL = 'http://127.0.0.1:8000/estoques/item-estoque/';

export const updateStockItem = async (id: number, item: StockItemFormInputs): Promise<HttpStatusCode> => {
  try {
    const response = await axios.put<AxiosResponse>(`${BASE_URL}${id}/alterar/`, item);
    if (response) return response.status;
    else return axios.HttpStatusCode.InternalServerError;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status) {
        return axiosError.response.status;
      }
    }
    return axios.HttpStatusCode.InternalServerError;
  }
}
