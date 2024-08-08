import { getAPI } from "./BaseService";

// Tüm döviz kurlarını getirme fonksiyonu
export const getAllCurrencyRates = async () => {
  try {
    const response = await getAPI("/api/currencyrates");
    return response.data;
  } catch (error) {
    throw error;
  }
};
