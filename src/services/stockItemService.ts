import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import { StockItemFormInputs, TransferProductFormInputs } from '../pages/EditStock';

const BASE_URL = 'https://controleestoque.pythonanywhere.com/estoques/item-estoque/';

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

export const createStockItem = async (item: StockItemFormInputs): Promise<HttpStatusCode> => {
  try {
    const response = await axios.post<AxiosResponse>(`${BASE_URL}novo/`, item);
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

export const deleteStockItem = async (id: number): Promise<HttpStatusCode> => {
  try {
    const response = await axios.delete<AxiosResponse>(`${BASE_URL}${id}/excluir/`);
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

export const createProductTransfer = async (transferInfo: TransferProductFormInputs): Promise<HttpStatusCode> => {
  try {
    const response = await axios.post<AxiosResponse>(`${BASE_URL}transferir/`, transferInfo);
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
