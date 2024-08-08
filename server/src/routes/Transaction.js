import express from "express";
import { getAllTransactions, getFilteredTransactions, hideTransaction,getRecentTransactions, getTotalTransactionCount, getWeeklyTransactions  } from "../controllers/Transaction.js";

const router = express.Router();

// Tüm işlemleri getir
router.get("/", getAllTransactions);

// Belirli bir filtre ile işlemleri getir
router.get("/filter", getFilteredTransactions);

// Belirli bir gizleme ile işlemleri getir
router.post("/hide", hideTransaction);

// Endpoint to get total invoice number
router.get("/recent", async (req, res) => {
    try {
      const data = await getRecentTransactions(req,res);
      res.status(200).json({ data });
    } catch (error) {
      console.error("Error fetching total invoice number:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

  // Endpoint to get total invoice number
router.get("/count", async (req, res) => {
    try {
      const data = await getTotalTransactionCount(req,res);
      res.status(200).json({ data });
    } catch (error) {
      console.error("Error fetching total invoice number:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });

// Son 7 günün işlemlerini getir
router.get("/weekly", async (req, res) => {
    try {
        const data = await getWeeklyTransactions(req, res);
        if (data) {
            res.status(200).json(data);
        }
    } catch (error) {
        console.error("Error fetching weekly transactions:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


export { router as transactionRoutes };