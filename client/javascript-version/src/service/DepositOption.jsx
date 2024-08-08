import { getAPI } from "./BaseService";

export const getDepositOptions = async () => {
  try {
    const url = "/api/deposit-options";
    const response = await getAPI(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
