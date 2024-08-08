import User from "../models/User.js";
import Account from "../models/Account.js";
import DepositOption from "../models/Deposit_Option.js";
import Transaction from "../models/Transaction.js";
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// Sequelize bağlantısı oluştur
const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');





// User oluşturma
export const createUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, surname, email, and password are required." });
    }

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email." });
    }


    // Create a new user
    await User.create({ name, surname, email, password: password });

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Kullanıcıya ait bir örneği elde ettikten sonra şifreyi karşılaştırma işlemini yapabiliriz
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // At this point, user is authenticated

    // Generate JWT
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store token in HTTPOnly cookie
    res.cookie('token', token, { httpOnly: true });
    res.cookie('userId', user.user_id, { httpOnly: true });
    // Send token to client
    res.json({ token, userId: user.user_id, message: "Login successful." });

  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user." });
  }
};

// Kullanıcı çıkışı
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    res.clearCookie("userId");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Error logging out user." });
  }
};

// Tüm hesapları al
export const getAllAccounts = async (req, res) => {
  try {
    // Tüm hesapları veritabanından al
    const allAccounts = await Account.findAll();

    // İsteğe hazır veri
    const responseData = await Promise.all(
      allAccounts.map(async (account) => {
        const {
          accountID,
          accountName,
          accountType,
          iban,
          balance,
          availableBalance,
          currency,
          userID,
          depositOption,
          openDate,
        } = account;

        // Veri hazırlığı
        if (accountType === "Checking") {
          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            openDate,
          };
        } else {
          const depositOptionDetails = await DepositOption.findByPk(
            depositOption
          );

          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            depositOption: {
              depositOptionName: depositOptionDetails.name,
              depositOptionDescription: depositOptionDetails.description,
              interestRate: parseFloat(depositOptionDetails.interestRate),
              term: depositOptionDetails.term,
            },
            openDate,
          };
        }
      })
    );

    // Başarı mesajı ve tüm hesaplar ile yanıt ver
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving accounts:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving account information.",
      },
    });
  }
};

export const getAccountById = async (req, res) => {
  try {
    const accountId = req.params.id;
    const userId = req.params.userid;

    // Retrieve the account from the database based on its ID and user ID
    const account = await sequelize.query(
      `SELECT * FROM accounts WHERE accountID = ? AND userID = ?`,
      { replacements: [accountId, userId], type: sequelize.QueryTypes.SELECT }
    );

    // Check if the account exists
    if (!account || account.length === 0) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Prepare response payload
    const responseData = {
      accountName: account[0].accountName,
      accountType: account[0].accountType,
      iban: account[0].iban,
      balance: parseFloat(account[0].balance),
      availableBalance: parseFloat(account[0].availableBalance),
      currency: account[0].currency,
      userID: account[0].userID,
      openDate: account[0].openDate,
    };

    if (account[0].accountType === "Deposit") {
      const depositOption = await sequelize.query(
        `SELECT * FROM accounts WHERE depositOption = 2`,
        { replacements: [account[0].depositOption], type: sequelize.QueryTypes.SELECT }
      );

      responseData.depositOption = {
        depositOptionName: depositOption[0].name,
        depositOptionDescription: depositOption[0].description,
        interestRate: parseFloat(depositOption[0].interestRate),
        term: depositOption[0].term,
      };
    }

    // Respond with success message and account details
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving account by ID:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving account information.",
      },
    });
  }
};

export const getAccountTransactions = async (req, res) => {
  try {
    const { userid, accountID } = req.params;

    // Get the account by accountID and userID
    const account = await sequelize.query(
      `SELECT * FROM accounts WHERE userID = ? AND accountID = ?`,
      { replacements: [userid, accountID], type: sequelize.QueryTypes.SELECT }
    );

    if (!account || account.length === 0) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Retrieve transaction history for the account
    const transactions = await sequelize.query(
      `SELECT * FROM transactions WHERE senderAccountID = ? OR receiverAccountID = ?`,
      { replacements: [accountID, accountID], type: sequelize.QueryTypes.SELECT }
    );

    // Respond with success message and transaction history
    res.status(200).json({
      message: "success",
      data: transactions.map((transaction) => ({
        transactionID: transaction.transactionID,
        senderAccountID: transaction.senderAccountID,
        receiverAccountID: transaction.receiverAccountID,
        amount: parseFloat(transaction.amount),
        transactionType: transaction.transactionType,
        date: transaction.date,
        description: transaction.description,
      })),
    });
  } catch (error) {
    console.error("Error retrieving account transactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const { userid, accountID, transactionID } = req.params;

    // Retrieve the transaction from the database based on its ID and the associated account ID
    const transaction = await sequelize.query(
      `SELECT * FROM transactions WHERE transactionID = ? AND (senderAccountID = ? OR receiverAccountID = ?)`,
      { replacements: [transactionID, accountID, accountID], type: sequelize.QueryTypes.SELECT }
    );

    // Check if the transaction exists
    if (!transaction || transaction.length === 0) {
      return res.status(422).json({
        message: "fail",
        data: {
          error: "The specified account ID or transaction ID does not exist.",
        },
      });
    }

    // Prepare response payload
    const responseData = {
      transactionID: transaction[0].transactionID,
      senderAccountID: transaction[0].senderAccountID,
      receiverAccountID: transaction[0].receiverAccountID,
      amount: parseFloat(transaction[0].amount),
      transactionType: transaction[0].transactionType,
      date: transaction[0].date,
      description: transaction[0].description,
    };

    // Respond with success message and transaction details
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving transaction by ID:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving transaction information.",
      },
    });
  }
};

export const getAccounts = async (req, res) => {
  try {
    const userId = req.params.userid;
    console.log(userId, "bu user id");

    // Retrieve user accounts from the database
    const userAccounts = await sequelize.query(
      `SELECT * FROM accounts WHERE userID = ?`,
      { replacements: [userId], type: sequelize.QueryTypes.SELECT }
    );

    // Prepare response payload
    const responseData = await Promise.all(
      userAccounts.map(async (account) => {
        const {
          accountID,
          accountName,
          accountType,
          iban,
          balance,
          availableBalance,
          currency,
          userID,
          depositOption,
          openDate,
        } = account;

        if (accountType === "Checking") {
          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            openDate,
          };
        } else {
          const depositOptionDetails = await sequelize.query(
            `SELECT * FROM accounts WHERE depositOption = 2`,
            { replacements: [depositOption], type: sequelize.QueryTypes.SELECT }
          );

          return {
            accountID,
            accountName,
            accountType,
            iban,
            balance: parseFloat(balance),
            availableBalance: parseFloat(availableBalance),
            currency,
            userID,
            depositOption: {
              depositOptionName: depositOptionDetails[0].name,
              depositOptionDescription: depositOptionDetails[0].description,
              interestRate: parseFloat(depositOptionDetails[0].interestRate),
              term: depositOptionDetails[0].term,
            },
            openDate,
          };
        }
      })
    );

    // Respond with success message and user accounts
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving user accounts:", error);
    res.status(500).json({
      message: "fail",
      data: {
        error: "An error occurred while retrieving account information.",
      },
    });
  }
};
export const getNameSurnameById = async (userID) => {
  let userNameSurname;

  try {
    // Convert userID to integer
    const id = parseInt(userID, 10);

    // Check if userID is a valid integer
    if (isNaN(id)) {
      throw new Error('Invalid user ID');
    }

    userNameSurname = await sequelize.query(
      `SELECT * FROM users WHERE user_id = ?`,
      { replacements: [id], type: sequelize.QueryTypes.SELECT }
    );

    console.log("Query result:", userNameSurname);
    
    // If user is found, return name and surname
    if (userNameSurname.length > 0) {
      return {
        name: userNameSurname[0].name,
        surname: userNameSurname[0].surname
      };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    // Log the error
    console.error('Error executing query:', error);

    // Log query result if available
    if (userNameSurname !== undefined) {
      console.log("Query result:", userNameSurname);
    }

    // Throw a custom error message when an error occurs
    throw new Error('Error getting user name and surname: ' + error.message);
  }
};





export const getCheckingAccountById = async (req, res) => {
  try {
    const { userid, accountID } = req.params;

    // Find the checking account by accountID and userID
    const account = await sequelize.query(
      `SELECT * FROM accounts WHERE accountID = ? AND userID = ? AND accountType = 'Checking'`,
      { replacements: [accountID, userid], type: sequelize.QueryTypes.SELECT }
    );

    // If account doesn't exist, return error
    if (!account || account.length === 0) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: {
        accountID: account[0].accountID,
        accountType: account[0].accountType,
        balance: parseFloat(account[0].balance),
        userID: account[0].userID,
      },
    });
  } catch (error) {
    console.error("Error retrieving checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getCheckingAccountsByUserId = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find all checking accounts associated with the user
    const accounts = await sequelize.query(
      `SELECT * FROM accounts WHERE userID = ? AND accountType = 'Checking'`,
      { replacements: [userid], type: sequelize.QueryTypes.SELECT }
    );

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: accounts.map((account) => ({
        accountID: account.accountID,
        accountType: account.accountType,
        balance: parseFloat(account.balance),
        userID: account.userID,
      })),
    });
  } catch (error) {
    console.error("Error retrieving checking accounts:", error);
    res.status(500).json({ message: "Unable to retrieve checking accounts." });
  }
};

export const getDepositAccountById = async (req, res) => {
  try {
    const { userid, accountID } = req.params;

    // Find the deposit account by accountID and userID
    const account = await sequelize.query(
      `SELECT * FROM accounts WHERE accountID = ? AND userID = ? AND accountType = 'Deposit'`,
      { replacements: [accountID, userid], type: sequelize.QueryTypes.SELECT }
    );

    // If account doesn't exist, return error
    if (!account || account.length === 0) {
      return res.status(422).json({
        message: "fail",
        data: { error: "The specified account ID does not exist." },
      });
    }

    // Find the deposit option details
    const depositOption = await sequelize.query(
      `SELECT * FROM accounts WHERE depositOption = 2`,
      { replacements: [account[0].depositOption], type: sequelize.QueryTypes.SELECT }
    );

    // Respond with success message and account details
    res.status(200).json({
      message: "success",
      data: {
        accountID: account[0].accountID,
        accountType: account[0].accountType,
        balance: parseFloat(account[0].balance),
        userID: account[0].userID,
        depositOption: {
          depositOptionName: depositOption[0].name,
          depositOptionDescription: depositOption[0].description,
          interestRate: parseFloat(depositOption[0].interestRate),
          term: depositOption[0].term,
        },
      },
    });
  } catch (error) {
    console.error("Error retrieving deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getDepositAccountsByUserId = async (req, res) => {
  try {
    const { userid } = req.params;

    // Find all deposit accounts associated with the user
    const accounts = await sequelize.query(
      `SELECT * FROM accounts WHERE userID = ? AND accountType = 'Deposit'`,
      { replacements: [userid], type: sequelize.QueryTypes.SELECT }
    );

    // Prepare response payload
    const responseData = await Promise.all(
      accounts.map(async (account) => {
        const depositOption = await sequelize.query(
          `SELECT * FROM accounts WHERE depositOption = 2`,
          { replacements: [account.depositOption], type: sequelize.QueryTypes.SELECT }
        );

        return {
          accountID: account.accountID,
          accountType: account.accountType,
          balance: parseFloat(account.balance),
          userID: account.userID,
          depositOption: {
            depositOptionName: depositOption[0].name,
            depositOptionDescription: depositOption[0].description,
            interestRate: parseFloat(depositOption[0].interestRate),
            term: depositOption[0].term,
          },
        };
      })
    );

    // Respond with success message and account details
    res.status(200).json({ message: "success", data: responseData });
  } catch (error) {
    console.error("Error retrieving deposit accounts:", error);
    res.status(500).json({ message: "Unable to retrieve deposit accounts." });
  }
};

// Karanlık modun mevcut durumunu al
export const getDarkModeStatus = async () => {
  try {
    const [result] = await sequelize.query(
      'SELECT * FROM ayarlar WHERE ayar_adi = "dark_mode"'
    );
    return result.length > 0 ? result[0].ayar_degeri : false;
  } catch (error) {
    console.error("Error getting dark mode status:", error);
    throw new Error("Error getting dark mode status.");
  }
};

// Karanlık modun durumunu tersine çevir
export const setDarkModeStatus = async () => {
  try {
    await sequelize.query(
      'UPDATE ayarlar SET ayar_degeri = IF(ayar_degeri = "true", "false", "true") WHERE ayar_adi = "dark_mode"',
      {
        type: Sequelize.QueryTypes.UPDATE
      }
    );
  } catch (error) {
    console.error("Error toggling dark mode status:", error);
    throw new Error("Error toggling dark mode status.");
  }
};


