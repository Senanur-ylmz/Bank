import mysql from "mysql2/promise";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from 'node-cron';
import fetch from 'node-fetch'; // fetch modülünü yükleyin

// Routes
import { userRoutes } from "./routes/User.js";
import { accountRoutes } from "./routes/Account.js";
import { depositOptionRoutes } from "./routes/Deposit_Option.js";
import { invoiceRoutes } from "./routes/Invoices.js";
import { transactionRoutes } from "./routes/Transaction.js";
import { firmRoutes } from "./routes/Firms.js";
import { currencyRateRoutes } from "./routes/CurrencyRate.js";
import { altinlarRoutes } from "./routes/Altin.js";
// Models
import User from "./models/User.js";
import InvoiceModel from "./models/Invoices.js";
import Account from './models/Account.js';
import Transaction from './models/Transaction.js';
import FirmModel from './models/Firms.js';
import Altin from './models/Altin.js'; // Altin modelini ekleyin
import CurrencyRate from './models/CurrencyRate.js';

import { loginUser } from "./controllers/User.js";
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

// App Config
const app = express();
dotenv.config();

// Middlewares
app.use(express.json());

const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Log handler
app.use((req, res, next) => {
  const { method, url, hostname, ip } = req;
  const timestamp = new Date();
  res.on("finish", () => {
    console.log(
      `${timestamp} - ${method} - ${url} - ${hostname} - ${ip} - ${res.statusCode}`
    );
  });
  next();
});

import jwt from 'jsonwebtoken';
import Firm from "./models/Firms.js";

// Middleware to authenticate user using JWT
app.use((req, res, next) => {
  // Extract the token from request headers
  const authorizationHeader = req.headers.authorization;

  // Check if authorization header exists
  if (!authorizationHeader) {
    // If the route is '/api/login' or '/api/register', continue to the next middleware or route
    if (req.path === '/api/users/login' || req.path === '/api/users/register' || req.path === 'api/users/logout') {
      return next();
    } else {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }
  }

  // Split the authorization header to get the token part
  const tokenParts = authorizationHeader.split(' ');

  // Check if token has correct format (Bearer <token>)
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization header format' });
  }

  // Extract the token
  const token = tokenParts[1];

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      // Check if the token has expired
      const now = Date.now() / 1000;
      if (decodedToken.exp <= now) {
        
        return res.status(401).json({ message: 'Token expired' });
      }

      // If token is valid, set the user ID in request object
      req.userId = decodedToken.userId;
      next();
    }
  });
});



// Example route that requires authentication
app.get('/api/protected', (req, res) => {
  // Access userId from request object
  const userId = req.userId;
  res.json({ message: `Protected route accessed by user ${userId}` });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/deposit-options", depositOptionRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/firms", firmRoutes);
app.use("/api/currencyrates", currencyRateRoutes);
app.use("/api/altinlar", altinlarRoutes);
// Invalid Path Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Invalid path" });
});

// Error Handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Internal Server Error";
  res.status(errorStatus).json({ message: errorMessage });
});

// Connect to MySQL Database
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const updateCeyrekAltinFiyatlari = async () => {
  try {
    // API'den verileri çekin
    const response = await fetch('https://api.genelpara.com/embed/altin.json');
    const data = await response.json();

    // Ceyrek altın verilerini alın
    const ceyrekAltinData = data['C'];

    // Alış ve satış fiyatlarını güncelleyin
    let updatedAltin = await Altin.findByPk(1); // 1 numaralı altın için varsayılan olarak düşündüm

    // Eğer kayıt bulunamazsa, yeni bir kayıt oluşturun
    if (!updatedAltin) {
      updatedAltin = await Altin.create({
        altin_id: 1,
        gram_altin_miktari: 1, // veya uygun bir değer
        alis_fiyati: parseFloat(ceyrekAltinData.alis),
        satis_fiyati: parseFloat(ceyrekAltinData.satis),
        tarih: new Date() // veya uygun bir değer
      });
    } else {
      // Kayıt bulunduğunda, değerleri güncelleyin
      updatedAltin.alis_fiyati = parseFloat(ceyrekAltinData.alis); // Alış fiyatını güncelle
      updatedAltin.satis_fiyati = parseFloat(ceyrekAltinData.satis); // Satış fiyatını güncelle
      await updatedAltin.save();
    }

    console.log('Ceyrek altın fiyatları güncellendi:', updatedAltin.toJSON());
  } catch (error) {
    console.error('Ceyrek altın fiyatları güncelleme hatası:', error);
  }
};

async function updateCurrencyRates() {
  try {
      const response = await fetch('https://api.genelpara.com/embed/doviz.json');
      const rates = await response.json();

      for (const currencyCode in rates) {
          const { satis, alis, degisim, d_oran, d_yon } = rates[currencyCode];

          // CurrencyCode'ya göre mevcut kaydı bul
          let currencyRecord = await CurrencyRate.findOne({ where: { CurrencyCode: currencyCode } });

          // Eğer kayıt yoksa yeni bir kayıt oluştur
          if (!currencyRecord) {
              currencyRecord = await CurrencyRate.create({
                  CurrencyCode: currencyCode,
                  SaleRate: satis,
                  PurchaseRate: alis,
                  ChangeAmount: degisim,
                  ChangeRate: d_oran,
                  ChangeDirection: d_yon
              });
          } else {
              // Kayıt varsa güncelle
              await currencyRecord.update({
                  SaleRate: satis,
                  PurchaseRate: alis,
                  ChangeAmount: degisim,
                  ChangeRate: d_oran,
                  ChangeDirection: d_yon
              });
          }
      }

      console.log('Currency rates updated successfully.');
  } catch (error) {
      console.error('Error updating currency rates:', error.message);
  }
}



// Frekansı güncelleme fonksiyonu
const updateFrequency = async () => {
  try {
    // Bugünkü tarihi al
    const today = new Date();
    
    // Tüm faturaları al
    const allInvoices = await InvoiceModel.findAll({ where: { frequency: 0 } });

    // Tüm faturalar için döngü oluşturarak frekansları kontrol et ve güncelle
    for (const invoice of allInvoices) {
      // Faturanın tarihini al
      const invoiceDate = invoice.date;

      // Faturanın frekansını dakika cinsinden hesapla
      const differenceInMinutes = Math.ceil((today - invoiceDate) / (1000 * 60));

      // Farka göre frekansı güncelle
      if (differenceInMinutes >= 1) {
        const updatedFrequency = invoice.frequency - (differenceInMinutes - 1);
        invoice.frequency = updatedFrequency > 0 ? updatedFrequency : 0; // Frekansın sıfırdan küçük olmamasını sağla
        await invoice.save();
        console.log(`Invoice ID ${invoice._id} için frekans başarıyla güncellendi: ${invoice.frequency}`);
      } else {
        console.log(`Invoice ID ${invoice._id} için frekans güncelleme gerektirmiyor.`);
      }
    }

    console.log("Tüm faturaların frekansı başarıyla güncellendi.");
  } catch (error) {
    console.error("Frekans güncelleme sırasında bir hata oluştu:", error);
  }
};

const processZeroFrequencyInvoices = async () => {
  try {
    // Tüm faturaları al
    const allInvoices = await InvoiceModel.findAll({attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }}  );

    // Her bir fatura için işlem yap
    for (const invoice of allInvoices) {

      // Ödenmiş faturaları işleme
      if (invoice.paid === true) {
        console.log(`Invoice ${invoice.invoiceID} is already paid. Skipping transaction.`);
        continue; // Ödenmiş faturaları işlemeye devam etme
      }

      // Duedate'den invoice date'i çıkar ve gün bazında hesap yap
      const dueDate = new Date(invoice.dueDate);
      const invoiceDate = new Date(invoice.invoiceDate);
      const differenceInDays = Math.floor((dueDate - invoiceDate) / (1000 * 60 * 60 * 24));
      //differenceindaysi düzelt. adam due date ve invoicedateyi geçmiş tarih giremez!
      // Eğer fatura günü gelmişse işlem yap
      if (differenceInDays === 0) {
        if (!invoice.receiverAccountID.startsWith("TR")) {
          const senderAccount = await Account.findOne({
            where: { accountID: invoice.senderAccountID },
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          });
          const recipientAccount = await FirmModel.findOne({ where: { company_name: invoice.receiverAccountID }});
          const senderBalance = parseFloat(senderAccount.balance);
          const invoiceAmount = parseFloat(invoice.amount);
          if (senderBalance >= invoiceAmount) {
            // Hesaptan para çekme işlemi
            senderAccount.balance -= invoiceAmount;
            await Account.update({ balance: senderAccount.balance }, { where: { accountID: senderAccount.accountID } });
            console.log(`Account ${senderAccount.accountID} balance updated: ${senderAccount.balance}`);

            // Faturayı ödenmiş olarak işaretleme
            invoice.paid = true;
            await InvoiceModel.update({ paid: invoice.paid }, { where: { invoiceID: invoice.invoiceID },
              attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
            console.log(`Invoice ${invoice.invoiceID} paid successfully`);

            // Alıcıya ödemenin yapıldığını belirten bilgiyi güncelleme
            recipientAccount.payment_status = "Paid";
            await FirmModel.update({ payment_status: recipientAccount.payment_status }, { where: { company_name: recipientAccount.company_name } });
            console.log(`Firm payment status updated: ${recipientAccount.payment_status}`);

            // Transaction kaydı oluşturma
            const transaction = new Transaction({
              senderAccountID: senderAccount.accountID,
              receiverAccountID: recipientAccount.subscription_id,
              amount: invoiceAmount,
              transactionType: "Firm Invoice",
              description: `Invoice ${invoice.invoiceID} için, ${senderAccount.accountID} hesabından ${recipientAccount.company_name} firmasına ${invoiceAmount} tutarında para gönderildi.`,
            });
            await transaction.save();
            console.log(`Transaction for invoice ${invoice.invoiceID} created:`, transaction);
          } else {
            console.log(`Insufficient balance for account ${senderAccount.accountID}`);
            // Yetersiz bakiye hatası aldığında faturayı sil
            await InvoiceModel.findByIdAndDelete(invoice._id);
            console.log(`Invoice ${invoice.invoiceID} deleted due to insufficient balance. Balance ${senderAccount.balance}, amount ${invoice.amount}`);
          }
        } else {
          const senderAccount = await Account.findOne({
            where: { accountID: invoice.senderAccountID },
            attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
          });
          console.log(invoice.receiverAccountID);
          const recipientAccount = await Account.findOne({
            where: { iban: invoice.receiverAccountID },
            attributes: ['accountID', 'iban'], // 'accountID' ve 'iban' alanlarını getir
        });
          console.log(recipientAccount);
          console.log(senderAccount.iban, recipientAccount.iban, "IBANLAR");
          // Fatura gönderenin IBAN'ı ile alıcının IBAN'ı aynı değilse işlem yap
          if (senderAccount.iban !== recipientAccount.iban) {
            // Hesaptan para çekme işlemi
            const senderBalance = parseFloat(senderAccount.balance);
            const invoiceAmount = parseFloat(invoice.amount);
            console.log(senderBalance,invoiceAmount);
            if (senderBalance >= invoiceAmount) {
              senderAccount.balance -= invoice.amount;
              console.log(senderAccount.balance);
              await Account.update({ balance: senderAccount.balance }, { where: { accountID: senderAccount.accountID } });

              console.log(`Account ${senderAccount.accountID} balance updated: ${senderAccount.balance}`);

              // Alıcı IBAN'ına para ekleme işlemi
              let recipientBalance = Number(recipientAccount.balance);
              recipientBalance = isNaN(recipientBalance) ? 0 : recipientBalance;
              
              // Alıcı IBAN'ına para ekleme işlemi
              recipientBalance += Number(invoice.amount);
              await Account.update({ balance: recipientBalance }, { where: { accountID: recipientAccount.accountID } });
              console.log(`Recipient account ${recipientAccount.iban} balance updated: ${recipientBalance}`);

              // Faturayı ödenmiş olarak işaretleme
              invoice.paid = true;
              await InvoiceModel.update({ paid: invoice.paid }, { where: { invoiceID: invoice.invoiceID },
                attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
              console.log(`Invoice ${invoice.invoiceID} paid successfully`);

              // Transaction kaydı oluşturma
              const transaction = new Transaction({
                senderAccountID: senderAccount.accountID,
                receiverAccountID: recipientAccount.accountID,
                amount: invoice.amount,
                transactionType: "Individual Invoice",
                description: `Invoice ${invoice.invoiceID} için, ${senderAccount.accountID} hesabından ${recipientAccount.accountID} hesabına ${invoice.amount} tutarında para gönderildi.`,
              });
              await transaction.save();
              console.log(`Transaction for invoice ${invoice.invoiceID} created:`, transaction);
            } else {
              console.log(`Insufficient balance for account ${senderAccount.accountID}`);
              console.log(typeof senderAccount.balance, typeof invoice.amount);
              // Yetersiz bakiye hatası aldığında faturayı sil
              await sequelize.query(
                'DELETE FROM invoices WHERE invoiceID = :invoiceId',
                { replacements: { invoiceId: invoice.invoiceID } }
              );
            }
          } else {
            // Gönderen ile alıcının IBAN'ları aynıysa faturayı sil
            await sequelize.query(
              'DELETE FROM invoices WHERE invoiceID = :invoiceId',
              { replacements: { invoiceId: invoice.invoiceID } }
            );
            console.log(`Invoice ${invoice.invoiceID} deleted because sender and recipient have the same IBAN.`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error processing zero frequency invoices:", error);
  }
};



// cron işlevi
cron.schedule('*/10 * * * * *', () => {
  processZeroFrequencyInvoices();
  //updateCeyrekAltinFiyatlari();
  //updateCurrencyRates();
});

// Listen Server
const PORT = 8080;
const listener = app.listen(PORT, () => {
  console.log(`Server listening on port ${listener.address().port}`);
});
