import axios from "axios";
import { Product } from "../interfaces/models/Product";
import { ProductFormInputs } from "../pages/NewProduct";

const BASE_URL = 'http://127.0.0.1:8000/api/produtos/'

export const getAllProducts = async (): Promise<Product[] | undefined> => {
  try {
    const response = await axios.get<Product[]>(BASE_URL);
    if (response.status === axios.HttpStatusCode.Ok) return response.data
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
