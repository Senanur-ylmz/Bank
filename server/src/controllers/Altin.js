// controllers/Altin.js

import Altin from '../models/Altin.js';

// Tüm altın verilerini getiren bir endpoint
export const getAllAltin = async (req, res) => {
  try {
    const altinlar = await Altin.findAll();
    res.json(altinlar);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Belirli bir altın verisini getiren bir endpoint
export const getAltinById = async (req, res) => {
  const { altin_id } = req.params;
  try {
    const altin = await Altin.findByPk(altin_id);
    if (!altin) {
      return res.status(404).json({ error: 'Altin not found' });
    }
    res.json(altin);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
