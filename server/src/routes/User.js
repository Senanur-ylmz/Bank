import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getAccounts,
  getAllAccounts,
  getAccountById,
  getCheckingAccountById,
  getCheckingAccountsByUserId,
  getDepositAccountById,
  getDepositAccountsByUserId,
  getAccountTransactions,
  getTransactionById,
  getNameSurnameById,
  getDarkModeStatus,
  setDarkModeStatus
} from "../controllers/User.js";

const router = express.Router();

// Endpoint to register a new user
router.post("/register", async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get user's name and surname by ID
router.get('/:userid/namesurname', async (req, res) => {
  try {
    const userID = req.params.userid;
    
    // Log the userID
    console.log('User ID:', userID);

    // Call the getNameSurnameById function with the userID
    const userNameSurname = await getNameSurnameById(userID);

    // Send the response with the user's name and surname
    res.status(200).json(userNameSurname);
  } catch (error) {
    // Handle errors
    console.error('Error getting user\'s name and surname by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to login a user
router.post("/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to logout a user by clearing the cookie
router.delete("/logout", async (req, res) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all accounts for a user
router.get("/:userid/accounts", async (req, res) => {
  try {
    await getAccounts(req, res);
  } catch (error) {
    console.error("Error getting user accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all accounts for a user
// su anlik kullanmayacagiz.
router.get("/accounts", async (req, res) => {
  try {
    await getAllAccounts(req, res);
  } catch (error) {
    console.error("Error getting user accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Endpoint to get a specific account by accountID
router.get("/:userid/accounts/:id", async (req, res) => {
  try {
    await getAccountById(req, res);
  } catch (error) {
    console.error("Error getting user account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific checking account by accountID
router.get("/:userid/checking-accounts/:accountID", async (req, res) => {
  try {
    await getCheckingAccountById(req, res);
  } catch (error) {
    console.error("Error getting user checking account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all checking account by userID
router.get("/:userid/checking-accounts", async (req, res) => {
  try {
    await getCheckingAccountsByUserId(req, res);
  } catch (error) {
    console.error("Error getting user checking accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific deposit account by accountID
router.get("/:userid/deposit-accounts/:accountID", async (req, res) => {
  try {
    await getDepositAccountById(req, res);
  } catch (error) {
    console.error("Error getting user deposit account:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all deposit account by userID
router.get("/:userid/deposit-accounts", async (req, res) => {
  try {
    await getDepositAccountsByUserId(req, res);
  } catch (error) {
    console.error("Error getting user deposit accounts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all transactions for a specific account
router.get("/:userid/accounts/:accountID/transactions", async (req, res) => {
  try {
    await getAccountTransactions(req, res);
  } catch (error) {
    console.error("Error getting user account transactions:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific transaction by transactionID
router.get(
  "/:userid/accounts/:accountID/transactions/:transactionID",
  async (req, res) => {
    try {
      await getTransactionById(req, res);
    } catch (error) {
      console.error("Error getting user transaction:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Endpoint to get dark mode status for a user
router.get("/darkmode", async (req, res) => {
  try {
    const userId = req.params.userid;
    const darkModeStatus = await getDarkModeStatus(userId);
    res.status(200).json({ darkMode: darkModeStatus });
  } catch (error) {
    console.error("Error getting dark mode status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to set dark mode status for a user
router.post("/darkmode", async (req, res) => {
  try {
    const userId = req.params.userid;
    const { darkMode } = req.body;
    await setDarkModeStatus(userId, darkMode);
    res.status(200).json({ message: "Dark mode status updated successfully." });
  } catch (error) {
    console.error("Error setting dark mode status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export { router as userRoutes };
