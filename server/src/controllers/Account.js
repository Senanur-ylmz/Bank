import { Sequelize } from 'sequelize';
import {generateIBAN, generateUniqueAccountID} from '../models/Account.js';
import DepositOption from '../models/Deposit_Option.js';
import Account from '../models/Account.js';
import User from '../models/User.js';
const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');



export const getTotalAccountCount = async (req,res) => {
  try {
    let userID;
    const cookie = req.headers.cookie; // "userId=13; token=abcdef; ..."
    if (cookie) {
      const cookieParts = cookie.split(';');
      for (const part of cookieParts) {
        const [key, value] = part.split('=');
        if (key.trim() === 'userId') {
          userID = value.trim();
          break;
        }
      }
    }
    const response = await sequelize.query(
      `SELECT COUNT(*) as totalAccountCount FROM accounts WHERE userID = ?`,
      { 
        replacements: [userID], // Pass userID as a replacement value
        type: sequelize.QueryTypes.SELECT 
      }
    );
    return response[0].totalAccountCount;
  } catch (error) {
    console.error("Error retrieving total account count:", error);
    throw error;
  }
};

// Yeni altın hesabı oluşturma
export const createGoldAccount = async (req, res) => {
  try {
    let { balance, accountName } = req.body;

    // Get the userID from the cookie
    const cookie = req.headers.cookie; // "userId=13; token=abcdef; ..."
    let userID;
    let depositOption = 3;
    
    if (cookie) {
      const cookieParts = cookie.split(';');
      for (const part of cookieParts) {
        const [key, value] = part.split('=');
        if (key.trim() === 'userId') {
          userID = value.trim();
          break;
        }
      }
    }

    


    // Generate IBAN for the account
    const accountID = await generateUniqueAccountID(); // Bekle
    const iban = await generateIBAN(accountID); // Bekle // Assuming you have a function to generate IBAN

    // Get current date and time
    const openDate = new Date();
    console.log(userID, 'Gold', balance, iban, 'XAU', accountID, openDate);

    // Insert new gold account into the database
    const [goldAccount, created] = await sequelize.query(
      'INSERT INTO accounts (userID, accountType, balance, iban, currency, openDate, accountName, depositOption) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      { replacements: [userID, 'Gold', balance, iban, 'XAU', openDate, accountName, depositOption] }
    );

    if (!created) {
      return res.status(500).json({ message: "fail", data: { error: "Failed to create gold account." } });
    }

    // Respond with success message and accountID
    res.status(201).json({
      message: "success",
      data: { accountID: goldAccount.insertId },
    });
  } catch (error) {
    console.error("Error creating gold account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};




export const getAccountByIBAN = async (iban) => {
  try {
    // Veritabanından belirli bir IBAN numarasına sahip hesabı al
    const account = await Account.findOne({ 
      where: { iban: iban }, 
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } 
    });

    // Hesap bulunamazsa hata döndür
    if (!account) {
      return null; // veya isteğe göre farklı bir hata döndürülebilir
    }

    // Hesap bulunursa ilgili kullanıcıyı bul
    const user = await User.findOne({ where: { user_id: account.userID } });

    // Kullanıcı bulunamazsa hata döndür
    if (!user) {
      return null; // veya isteğe göre farklı bir hata döndürülebilir
    }

    // Hesap bulunursa veriyi hazırla ve döndür
    const responseData = {
      name:user.name,
      surname:user.surname,
      receiverAccountID:account.accountID
    };

    return responseData;
  } catch (error) {
    throw error;
  }
};



export const createCheckingAccount = async (req, res) => {
  try {
    let { accountName, balance, availableBalance, currency, depositOption } = req.body;

    // Get the userID from the cookie
    const cookie = req.headers.cookie; // "userId=13; token=abcdef; ..."
    let userID;
    
    if (cookie) {
      const cookieParts = cookie.split(';');
      for (const part of cookieParts) {
        const [key, value] = part.split('=');
        if (key.trim() === 'userId') {
          userID = value.trim();
          break;
        }
      }
    }
    // Default values for balance and availableBalance
    balance = 0;
    availableBalance = 0;
    depositOption = 1;
    // Generate IBAN for the account
    const accountID = await generateUniqueAccountID(); // Bekle

    const iban = await generateIBAN(accountID); // Bekle // Assuming you have a function to generate IBAN

    

    // Check if all required fields are provided
    if (!accountName || isNaN(balance) || isNaN(availableBalance) || !currency) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Insert new checking account into the database
    const [checkingAccount, created] = await sequelize.query(
      'INSERT INTO accounts (userID, depositOption, accountName, accountType, iban, balance, availableBalance, currency) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      { replacements: [userID, depositOption, accountName, 'Checking', iban, balance, availableBalance, currency] }
    );

    if (!created) {
      return res.status(500).json({ message: "fail", data: { error: "Failed to create checking account." } });
    }

    // Respond with success message and accountID
    res.status(201).json({
      message: "success",
      data: { accountID: checkingAccount.insertId },
    });
  } catch (error) {
    console.error("Error creating checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



// Hesabı silme
export const deleteAccountById = async (req, res) => {
  try {
    const { accountID } = req.params;

    // Delete the account from the database
    const deleted = await sequelize.query(
      'DELETE FROM accounts WHERE accountID = ?',
      { replacements: [accountID] }
    );

    if (deleted[0].affectedRows === 0) {
      return res.status(404).json({ message: "fail", data: { error: "Account not found." } });
    }

    // Respond with success message and deleted accountID
    res.status(200).json({
      message: "success",
      data: { accountID },
    });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Hesap adını güncelleme
export const updateAccountName = async (req, res) => {
  try {
    const { accountID } = req.params;
    const { accountName } = req.body;

    // Check if accountName is provided and valid
    if (!accountName || typeof accountName !== "string") {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid account name." },
      });
    }

    // Update the account name in the database
    const updated = await sequelize.query(
      'UPDATE accounts SET accountName = ? WHERE accountID = ?',
      { replacements: [accountName, accountID] }
    );

    if (updated[0].affectedRows === 0) {
      return res.status(404).json({ message: "fail", data: { error: "Account not found." } });
    }

    // Respond with success message and updated account details
    res.status(200).json({
      message: "success",
      data: { accountID: accountID, accountName: accountName },
    });
  } catch (error) {
    console.error("Error updating account name:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Yeni bir mevduat hesabı oluşturma
export const createDepositAccount = async (req, res) => {
  try {
    let {
      accountName,
      withdrawalAccountId,
      balance,
      availableBalance,
      currency,
      depositOptionID,
    } = req.body;

    
    // Get the userID from the cookie
    const cookie = req.headers.cookie; // "userId=13; token=abcdef; ..."
    let userID;
    
    if (cookie) {
      const cookieParts = cookie.split(';');
      for (const part of cookieParts) {
        const [key, value] = part.split('=');
        if (key.trim() === 'userId') {
          userID = value.trim();
          break;
        }
      }
    }
    balance = 0;
    availableBalance = 0;
    depositOptionID = 2;

    const accountID = await generateUniqueAccountID(); // Bekle
    const iban = await generateIBAN(accountID); // Bekle // Assuming you have a function to generate IBAN

    console.log(      accountName,
      withdrawalAccountId,
      balance,
      availableBalance,
      currency,
      depositOptionID);
    // Check if all required fields are provided
    if (
      !accountName ||
      !withdrawalAccountId ||
      isNaN(balance) ||
      isNaN(availableBalance) ||
      !currency ||
      !depositOptionID
    ) {
      return res.status(422).json({
        message: "fail",
        data: { error: "Missing or invalid fields in request body." },
      });
    }

    // Insert new deposit account into the database
    const [depositAccount, created] = await sequelize.query(
      'INSERT INTO accounts (userID, accountName, accountType, balance, availableBalance, currency, depositOption, withdrawalAccountId, iban) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      { replacements: [userID, accountName, 'Deposit', balance, availableBalance, currency, depositOptionID, withdrawalAccountId, iban] }
    );

    if (!created) {
      return res.status(500).json({ message: "fail", data: { error: "Failed to create deposit account." } });
    }

    // Respond with success message and accountID
    res.status(201).json({
      message: "success",
      data: { accountID: depositAccount.insertId },
    });
  } catch (error) {
    console.error("Error creating deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
