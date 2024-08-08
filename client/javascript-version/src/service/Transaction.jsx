import { getAPI, postAPI } from "./BaseService";

// Tüm işlemleri getirme fonksiyonu
export const getAllTransactions = async (userID) => {
  try {
    const response = await getAPI(`/api/transactions?userID=${userID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


// Belirli bir filtreye göre işlemleri getirme fonksiyonu
export const getFilteredTransactions = async (filterType, filterValue, userID) => {
  try {
    const response = await getAPI(`/api/transactions/filter?filterType=${filterType}&filterValue=${filterValue}&userID=${userID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Gizli işlemi güncelle
export const hideTransaction = async (userId, transactionId) => {
  try {
    // İşlemi veritabanında güncelle
    await postAPI(`/api/transactions/hide`, { userId, transactionId }); // Hide isteği gönder

    // Güncellenmiş işlemleri geri döndür
    const transactions = await getAllTransactions(userId); // Tüm işlemleri al
    return transactions;
  } catch (error) {
    throw error;
  }
};

// Haftalık işlemleri getirme fonksiyonu
export const getWeeklyTransactions = async () => {
  try {
    const response = await getAPI(`/api/transactions/weekly`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
