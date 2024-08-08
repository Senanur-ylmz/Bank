// routes/Firms.js
import express from "express";
import { getAllFirms, getFilteredFirm } from "../controllers/Firms.js";

const router = express.Router();

// Tüm firmaları getiren endpoint
router.get("/", getAllFirms);

// Filtrelenmiş firmaları getiren endpoint
router.post("/filter", getFilteredFirm);

export { router as firmRoutes };
