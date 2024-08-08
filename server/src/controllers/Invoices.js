import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');



// Toplam fatura sayısını getiren fonksiyon
export const getTotalInvoiceNumber = async () => {
  try {
    const [result] = await sequelize.query('SELECT COUNT(*) AS totalInvoiceNumber FROM invoices');
    return result[0].totalInvoiceNumber;
  } catch (error) {
    throw error;
  }
};

// Yeni bir fatura oluşturma
export const createInvoice = async (req, res) => {
  try {
    const { userID ,senderAccountID, receiverAccountID, receiverName, transactionType, description, amount, invoiceDate, dueDate } = req.body;
    const date = new Date();
    const paid = false;
    const finalDescription = description ? description : "Firm Invoice";
    console.log(senderAccountID, receiverAccountID, receiverName, transactionType, finalDescription, amount, invoiceDate, dueDate, paid, date);
    await sequelize.query(
      'INSERT INTO invoices (userID, senderAccountID, receiverAccountID, receiverName, transactionType, description, amount, invoiceDate, dueDate, paid, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, false, ?)',
      { replacements: [userID, senderAccountID, receiverAccountID, receiverName, transactionType, finalDescription, amount, invoiceDate, dueDate, date], type: Sequelize.QueryTypes.INSERT }
    );
    res.status(201).json({ userID, senderAccountID, receiverAccountID, receiverName, transactionType, finalDescription, amount, invoiceDate, dueDate, date });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Tüm faturaları belirli bir kullanıcıya göre getirme
export const getInvoices = async (req, res) => {
  try {
    const userId = req.query.userID;// Assuming the user ID is provided in the request parameters
    console.log(userId, "TETEETETETETETSST");

    const invoices = await sequelize.query('SELECT * FROM invoices WHERE userID = ?', {
      replacements: [userId],
      type: Sequelize.QueryTypes.SELECT
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


export const getTotalInvoiceCount = async (req, res) => {
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
      'SELECT COUNT(*) AS totalInvoiceNumber FROM invoices WHERE userID = ?',
      { 
        replacements: [userID], // Pass userID as a replacement value
        type: sequelize.QueryTypes.SELECT 
      }
    );
    return response[0].totalInvoiceNumber;
  } catch (error) {
    console.error("Error retrieving total invoice count:", error);
    throw error;
  }
};

// Faturayı ödenmiş olarak işaretleme
export const markInvoiceAsPaid = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;
    const [updatedInvoice] = await sequelize.query(
      'UPDATE invoices SET paid = true WHERE invoiceNumber = ?',
      { replacements: [invoiceNumber], type: Sequelize.QueryTypes.UPDATE }
    );
    if (updatedInvoice.affectedRows === 0) {
      return res.status(404).json({ message: "Invoice not found." });
    }
    res.status(200).json({ invoiceNumber, paid: true });
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
