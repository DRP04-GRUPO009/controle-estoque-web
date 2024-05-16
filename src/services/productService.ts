import axios, { AxiosResponse } from "axios";
import { Product } from "../interfaces/models/Product";
import { ProductFormInputs } from "../pages/NewProduct";
import { ProductListResponse } from "../interfaces/models/ProductListResponse";

const BASE_URL = 'https://controleestoque.pythonanywhere.com/produtos/'

export const getProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const response = await axios.get<Product>(`${BASE_URL}${id}/`);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const getAllProducts = async (page: number, ordering: string): Promise<ProductListResponse | undefined> => {
  try {
    const response = await axios.get<ProductListResponse>(`${BASE_URL}?ordering=${ordering}&page=${page}`);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const createProduct = async (product: ProductFormInputs): Promise<Product | undefined> => {
  try {
    const response = await axios.post<Product>(`${BASE_URL}novo/`, product);
    if (response.status === axios.HttpStatusCode.Created) return response.data;
  } catch (error) {
    error;
  }
}

export const updateProduct = async (id: number, product: ProductFormInputs): Promise<Product | undefined> => {
  try {
    const response = await axios.put<Product>(`${BASE_URL}${id}/alterar/`, product);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const deleteProduct = async (id: number): Promise<AxiosResponse | undefined> => {
  try {
    const response = await axios.delete<AxiosResponse>(`${BASE_URL}${id}/excluir/`);
    return response;
  } catch (error) {
    error;
  }
}
