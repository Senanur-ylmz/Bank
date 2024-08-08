import CurrencyRate from '../models/CurrencyRate.js';


// GET - Tüm döviz kurlarını getir
export const getAllCurrencyRates = async (req, res) => {
  try {
    const currencyRates = await CurrencyRate.findAll();
    res.status(200).json(currencyRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};