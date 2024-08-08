import { patchAPI, deleteAPI, postAPI } from "./BaseService";

export const updateAccountName = async (accountID, accountName) => {
  try {
    const response = await patchAPI(`/api/accounts/${accountID}`, {
      accountName: accountName,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (accountID) => {
  try {
    const response = await deleteAPI(`/api/accounts/${accountID}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAccount = async (account, type) => {
  if (type === "Deposit") {
    const response = await postAPI("api/accounts/deposit-accounts", account);
    return response;
  } else if (type === "Withdrawal") {
    console.log("burada");
    const response = await postAPI("api/accounts/checking-accounts", account);
    return response;
  }
};
