import axios, { AxiosResponse } from "axios";
import { SchoolUnit } from "../interfaces/models/SchoolUnit";

const BASE_URL = 'http://127.0.0.1:8000/unidades-escolares/'

export const getAllSchoolsUnits = async (): Promise<SchoolUnit[] | undefined> => {
  try {
    const response = await axios.get<SchoolUnit[]>(BASE_URL);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const getSchoolUnitById = async (id: number): Promise<SchoolUnit | undefined> => {
  try {
    const response = await axios.get<SchoolUnit>(`${BASE_URL}${id}/`);
    if (response.status === axios.HttpStatusCode.Ok) return response.data;
  } catch (error) {
    error;
  }
}

export const createSchoolUnit = async () => {
  // try {
    
  // } catch (error) {
  //   error;
  // }
}

export const deleteSchoolUnit = async (id: number): Promise<AxiosResponse | undefined> => {
  try {
    const response = await axios.delete<AxiosResponse>(`${BASE_URL}${id}/excluir/`);
    if (response) return response;
  } catch (error) {
    error;
  }
}
