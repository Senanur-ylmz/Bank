import express from 'express';
import { getAllCurrencyRates } from '../controllers/CurrencyRate.js';

const router = express.Router();

// Tüm döviz kurlarını getir
router.get('/', getAllCurrencyRates);

export { router as currencyRateRoutes };