import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

// Tüm firmaları getiren controller fonksiyonu
export const getAllFirms = async (req, res) => {
  try {
    const firms = await sequelize.query('SELECT * FROM firms', { type: Sequelize.QueryTypes.SELECT });
    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir kritere göre filtrelenmiş firmaları getiren controller fonksiyonu
export const getFilteredFirm = async (req, res) => {
  const { id, subscription_id } = req.body; // Filtreleme kriterlerini istek gövdesinden al

  try {
    let query = 'SELECT * FROM firms WHERE ';
    const replacements = [];

    // Eğer firmname verilmişse, firma adına göre filtrele
    if (id) {
      query += 'id = ? AND ';
      replacements.push(id);
    }

    // Eğer subscription_id verilmişse, abonelik kimliğine göre filtrele
    if (subscription_id) {
      query += 'subscription_id = ? AND ';
      replacements.push(subscription_id);
    }

    // Query stringin sonundaki gereksiz ' AND ' ifadesini kaldır
    query = query.slice(0, -5);

    // Filtreleme işlemini yap ve sonucu döndür
    const filteredFirms = await sequelize.query(query, { replacements, type: Sequelize.QueryTypes.SELECT });
    res.status(200).json(filteredFirms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
