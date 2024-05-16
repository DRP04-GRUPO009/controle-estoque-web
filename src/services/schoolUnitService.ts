import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";
import { SchoolUnitFormInputs } from "../pages/EditSchoolUnit";
import { SchoolUnitListResponse } from "../interfaces/models/ShoolUnitListResponse";
import { StockItem } from "../interfaces/models/StockItem";

const BASE_URL = 'https://controleestoque.pythonanywhere.com/unidades-escolares/'

export const getSchoolUnitById = async (id: number): Promise<SchoolUnit | undefined> => {
  try {
    const response = await axios.get<SchoolUnit>(`${BASE_URL}${id}/`);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const getAllSchoolsUnitsByPage = async (page: number): Promise<SchoolUnitListResponse | undefined> => {
  try {
    const response = await axios.get<SchoolUnitListResponse>(`${BASE_URL}?page=${page}`);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const getAllSchoolsUnits = async (): Promise<SchoolUnit[] | undefined> => {
  try {
    const response = await axios.get<SchoolUnit[]>(`${BASE_URL}`);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const createSchoolUnit = async (form: SchoolUnitFormInputs) : Promise<HttpStatusCode> => {
  try {
    const response = await axios.post<SchoolUnit>(`${BASE_URL}nova/`, form);
    if (response) return response.status;
    else return axios.HttpStatusCode.InternalServerError;
  } catch (error) {
    return axios.HttpStatusCode.InternalServerError;
  }
}

export const updateSchoolUnit = async (id: number, form: SchoolUnitFormInputs) : Promise<HttpStatusCode> => {
  try {
    const response = await axios.put<SchoolUnit>(`${BASE_URL}${id}/alterar/`, form);
    if (response) return response.status;
    else return axios.HttpStatusCode.InternalServerError;
  } catch (error) {
    return axios.HttpStatusCode.InternalServerError;
  }
}

export const deleteSchoolUnit = async (id: number): Promise<AxiosResponse | undefined> => {
  try {
    const response = await axios.delete<AxiosResponse>(`${BASE_URL}${id}/excluir/`);
    if (response) return response;
  } catch (error) {
    error;
  }
}

export const paginateStockItems = (items: StockItem[], pageSize: number): StockItem[][] => {
  const pages: StockItem[][] = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize))
  }
  return pages;
}
