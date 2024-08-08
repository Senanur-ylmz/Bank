// FirmsService.js
import { getAPI, postAPI } from "./BaseService";

export const getAllFirms = async () => {
  try {
    const response = await getAPI("/api/firms");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFilteredFirms = async (filterData) => {
  try {
    console.log(filterData, "filterdata");
    const response = await postAPI("/api/firms/filter", filterData);
    return response.data;
  } catch (error) {
    throw error;
  }
};