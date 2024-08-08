// routes/altinRoutes.js

import express from "express";
import { getAllAltin, getAltinById } from '../controllers/Altin.js';
import { createGoldAccount } from "../controllers/Account.js";

const router = express.Router();

// Tüm altın verilerini getiren endpoint
router.get('/', getAllAltin);

// Tüm altın verilerini getiren endpoint
router.post('/create', createGoldAccount);

// Belirli bir altın verisini getiren endpoint
router.get('/altinlar/:altin_id', getAltinById);

export { router as altinlarRoutes };
