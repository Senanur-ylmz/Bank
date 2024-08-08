import express from "express";
import {
  createDepositOption,
  updateDepositOption,
  deleteDepositOption,
  getDepositOptionById,
  getDepositOptions,
} from "../controllers/Deposit_Option.js";

const router = express.Router();

// Endpoint to create a new deposit option
router.post("/", async (req, res) => {
  try {
    await createDepositOption(req, res);
  } catch (error) {
    console.error("Error creating deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to update a deposit option by depositOptionID
router.patch("/:depositOptionID", async (req, res) => {
  try {
    await updateDepositOption(req, res);
  } catch (error) {
    console.error("Error updating deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to delete a deposit option by depositOptionID
router.delete("/:depositOptionID", async (req, res) => {
  try {
    await deleteDepositOption(req, res);
  } catch (error) {
    console.error("Error deleting deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get a specific deposit option by depositOptionID
router.get("/:depositOptionID", async (req, res) => {
  try {
    await getDepositOptionById(req, res);
  } catch (error) {
    console.error("Error getting deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint to get all deposit options
router.get("/", async (req, res) => {
  try {
    await getDepositOptions(req, res);
  } catch (error) {
    console.error("Error getting deposit options:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export { router as depositOptionRoutes };
