import Account from "../models/Account.js";
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');



export const getTotalTransactionCount = async (req,res) => {
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
    // Kullanıcının tüm hesaplarını al
    const userAccounts = await Account.findAll({ where: { userID }, attributes: ['accountID'] });

    let totalTransactionCount = 0;

    // Her hesap için işlem sayısını al ve toplam işlem sayısına ekle
    for (const account of userAccounts) {
      const countQuery = await sequelize.query(
        'SELECT COUNT(*) AS transactionCount FROM transactions WHERE senderAccountID = ? or receiverAccountID = ?',
        { 
          replacements: [account.accountID,account.accountID], 
          type: Sequelize.QueryTypes.SELECT 
        }
      );
      const transactionCount = countQuery[0].transactionCount;
      totalTransactionCount += transactionCount;
    }

    return totalTransactionCount;
  } catch (error) {
    throw error;
  }
};


export const getRecentTransactions = async (req, res) => {
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

    let totalAmount = 0; // Toplam miktar için başlangıç değeri

    // Kullanıcının tüm hesaplarını al
    const userAccounts = await Account.findAll({ where: { userID }, attributes: ['accountID'] });
    
    // Her bir hesap için son 5 işlem verisini al
    for (const account of userAccounts) {
      const sendertransactions = await sequelize.query(
        'SELECT * FROM transactions WHERE (senderAccountID = ?) AND (senderAccountID NOT IN (SELECT accountID FROM accounts WHERE userID = ?) OR receiverAccountID NOT IN (SELECT accountID FROM accounts WHERE userID = ?)) ORDER BY transactionDate DESC LIMIT 5',
        { replacements: [account.accountID, userID, userID], type: Sequelize.QueryTypes.SELECT }
      );
  
      // İşlemleri döngüye al ve amountları topla
      for (const transaction of sendertransactions) {
          // Eğer gönderen kullanıcı ise, amountı negatif olarak ekle
          totalAmount -= parseFloat(transaction.amount);
      }
    }

        // Her bir hesap için son 5 işlem verisini al
        for (const account of userAccounts) {
          const receivertransactions = await sequelize.query(
            'SELECT * FROM transactions WHERE (receiverAccountID = ?) AND (senderAccountID NOT IN (SELECT accountID FROM accounts WHERE userID = ?) OR receiverAccountID NOT IN (SELECT accountID FROM accounts WHERE userID = ?)) ORDER BY transactionDate DESC LIMIT 5',
            { replacements: [account.accountID, userID, userID], type: Sequelize.QueryTypes.SELECT }
          );
      
          // İşlemleri döngüye al ve amountları topla
          for (const transaction of receivertransactions) {
              // Eğer gönderen kullanıcı ise, amountı negatif olarak ekle
              totalAmount += parseFloat(transaction.amount);
          }
        }

    console.log("TOTAL AMOUNT", totalAmount);
    return totalAmount;
  } catch (error) {
    throw error;
  }
};




// Tüm işlemleri getir
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.query.userID;
    console.log(userId, "bu user id");
    const userAccounts = await Account.findAll({ where: { userId }, attributes: ['accountID'] }); // Kullanıcıya ait hesapları getir
    const accountIDs = userAccounts.map(account => account.accountID); // Hesap ID'lerini al
    const transactions = await sequelize.query(
      'SELECT * FROM transactions WHERE senderAccountID IN (?) OR receiverAccountID IN (?)',
      { replacements: [accountIDs, accountIDs], type: Sequelize.QueryTypes.SELECT }
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Belirli bir filtre ile işlemleri getir
export const getFilteredTransactions = async (req, res) => {
  const userId = req.query.userID; // Kullanıcının kimliğini al
  const { filterType, filterValue } = req.query;
  
  try {
    const userAccounts = await Account.findAll({ where: { userId }, attributes: ['accountID'] }); // Kullanıcıya ait hesapları getir
    const accountIDs = userAccounts.map(account => account.accountID); // Hesap ID'lerini al
    let filter = { [filterType]: filterValue };
    const transactions = await sequelize.query(
      `SELECT * FROM transactions 
       WHERE (senderAccountID IN (?) OR receiverAccountID IN (?)) 
       AND ${filterType} = ?`, 
      { replacements: [accountIDs, accountIDs, filterValue], type: Sequelize.QueryTypes.SELECT }
    );
    
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const hideTransaction = async (req, res) => {
  try {
    // İşlemi veritabanında güncelle
    const userId = req.body.userId; // Kullanıcının kimliğini al
    const { transactionId } = req.body; // İşlem kimliğini al
    console.log(transactionId, "COONSOOLE");
    const [updatedRows] = await sequelize.query(
      'UPDATE transactions SET isHide = NOT isHide WHERE transactionID = :transactionId',
      { replacements: { transactionId } }
    );

    if (updatedRows === 0) {
      // Güncelleme yapılmadıysa uygun bir hata döndür
      throw new Error('Transaction not found or you do not have permission to hide it.');
    }

    // Güncellenmiş işlemleri geri döndür
    const userAccounts = await Account.findAll({ where: { userId }, attributes: ['accountID'] });
    const accountIDs = userAccounts.map(account => account.accountID);
    const transactions = await sequelize.query(
      `SELECT * FROM transactions 
       WHERE (senderAccountID IN (?) OR receiverAccountID IN (?))`,
      { replacements: [accountIDs, accountIDs], type: Sequelize.QueryTypes.SELECT }
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};


export const getWeeklyTransactions = async (req, res) => {
  try {
    let userId;
    const cookie = req.headers.cookie; // "userId=13; token=abcdef; ..."
    if (cookie) {
      const cookieParts = cookie.split(';');
      for (const part of cookieParts) {
        const [key, value] = part.split('=');
        if (key.trim() === 'userId') {
          userId = value.trim();
          break;
        }
      }
    }

    // Son 7 gün içinde yapılan işlemleri çekmek için tarih aralığını hesapla
    const today = new Date();
    const weeklyTransactions = [];

    // Her bir gün için işlemleri çek ve toplam harcamayı hesapla
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000); // Bugünden geriye doğru günleri hesapla
      const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD formatına dönüştür

      const userAccounts = await Account.findAll({ where: { userId }, attributes: ['accountID'] }); // Kullanıcıya ait hesapları getir
      const accountIDs = userAccounts.map(account => account.accountID); // Hesap ID'lerini al
      
      // Sorgulanacak tarihte işlem yapıldığından emin ol
      const dailyTransactions = await sequelize.query(
        `SELECT * FROM transactions 
         WHERE (senderAccountID IN (?) OR receiverAccountID IN (?)) 
         AND DATE(transactionDate) = ?`,
        { replacements: [accountIDs, accountIDs, formattedDate], type: Sequelize.QueryTypes.SELECT }
      );

      // Gün bazında toplam harcamayı hesapla
      let dailyTotal = 0;
      for (const transaction of dailyTransactions) {
        if (transaction.senderAccountID === userId) {
          // Eğer gönderen kullanıcı ise, amountı negatif olarak ekle
          dailyTotal -= parseFloat(transaction.amount);
        } else {
          // Eğer gönderen kullanıcı değilse, amountı pozitif olarak ekle
          dailyTotal += parseFloat(transaction.amount);
        }
      }

      // Günlük toplamı diziye ekle
      weeklyTransactions.unshift(dailyTotal); // En son günü başa alarak ekleyelim
    }

    if (weeklyTransactions.length === 7) {
      res.status(200).json(weeklyTransactions);
    }
    
  } catch (error) {
    console.error('Error fetching weekly transactions:', error);
    res.status(500).json({ message: error.message });
  }
};


