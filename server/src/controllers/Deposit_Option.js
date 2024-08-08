import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

// Yeni bir mevduat seçeneği oluşturma
export const createDepositOption = async (req, res) => {
  try {
    const { depositOptionName, depositOptionDescription, interestRate, term } = req.body;

    // Check if all required fields are provided
    if (!depositOptionName || !depositOptionDescription || !interestRate || !term) {
      return res.status(422).json({ message: "fail", data: { error: "Missing or invalid fields in request body." } });
    }

    // Insert new deposit option into the database
    const [depositOption, created] = await sequelize.query(
      'INSERT INTO deposit_options (name, description, interestRate, term) VALUES (?, ?, ?, ?)',
      { replacements: [depositOptionName, depositOptionDescription, interestRate, term] }
    );

    if (!created) {
      return res.status(500).json({ message: "fail", data: { error: "Failed to create deposit option." } });
    }

    // Respond with success message and depositOptionID
    res.status(201).json({ message: "success", data: { depositOptionID: depositOption.insertId } });
  } catch (error) {
    console.error("Error creating deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Mevduat seçeneğini güncelleme
export const updateDepositOption = async (req, res) => {
  try {
    const depositOptionID = req.params.depositOptionID;
    const { depositOptionName, interestRate, term } = req.body;

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || isNaN(depositOptionID)) {
      return res.status(422).json({ message: "fail", data: { error: "Invalid deposit option ID." } });
    }

    // Check if all required fields are provided
    if (!depositOptionName || !interestRate || !term) {
      return res.status(422).json({ message: "fail", data: { error: "Missing or invalid fields in request body." } });
    }

    // Update the deposit option in the database
    const updated = await sequelize.query(
      'UPDATE deposit_options SET name = ?, interestRate = ?, term = ? WHERE id = ?',
      { replacements: [depositOptionName, interestRate, term, depositOptionID] }
    );

    if (updated[0].affectedRows === 0) {
      return res.status(404).json({ message: "fail", data: { error: "Deposit option not found." } });
    }

    // Respond with success message and updated deposit option details
    res.status(200).json({
      message: "success",
      data: {
        depositOptionID: depositOptionID,
        depositOptionName: depositOptionName,
        interestRate: interestRate,
        term: term,
      },
    });
  } catch (error) {
    console.error("Error updating deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Mevduat seçeneğini silme
export const deleteDepositOption = async (req, res) => {
  try {
    const depositOptionID = req.params.depositOptionID;

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || isNaN(depositOptionID)) {
      return res.status(422).json({ message: "fail", data: { error: "Invalid deposit option ID." } });
    }

    // Delete the deposit option from the database
    const deleted = await sequelize.query(
      'DELETE FROM deposit_options WHERE id = ?',
      { replacements: [depositOptionID] }
    );

    if (deleted[0].affectedRows === 0) {
      return res.status(404).json({ message: "fail", data: { error: "Deposit option not found." } });
    }

    // Respond with success message and deleted deposit option ID
    res.status(200).json({ message: "success", data: { depositOptionID: depositOptionID } });
  } catch (error) {
    console.error("Error deleting deposit option:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Belirli bir mevduat seçeneğini getirme
export const getDepositOptionById = async (req, res) => {
  try {
    const depositOptionID = req.params.depositOptionID;

    // Check if the provided depositOptionID is valid
    if (!depositOptionID || isNaN(depositOptionID)) {
      return res.status(422).json({ message: "fail", data: { error: "Invalid deposit option ID." } });
    }

    // Find the deposit option in the database
    const depositOption = await sequelize.query(
      `SELECT * FROM accounts WHERE depositOption = 2`,
      { replacements: [depositOptionID], type: Sequelize.QueryTypes.SELECT }
    );

    if (depositOption.length === 0) {
      return res.status(404).json({ message: "fail", data: { error: "Deposit option not found." } });
    }

    // Respond with success message and deposit option details
    res.status(200).json({
      message: "success",
      data: {
        depositOptionID: depositOption[0].id,
        depositOptionName: depositOption[0].name,
        depositOptionDescription: depositOption[0].description,
        interestRate: parseFloat(depositOption[0].interestRate),
        term: depositOption[0].term,
      },
    });
  } catch (error) {
    console.error("Error retrieving deposit option by ID:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Tüm mevduat seçeneklerini getirme
export const getDepositOptions = async (req, res) => {
  try {
    // Find all deposit options in the database
    const depositOptions = await sequelize.query('SELECT * FROM deposit_options', { type: Sequelize.QueryTypes.SELECT });

    // Respond with success message and deposit options
    res.status(200).json({
      message: "success",
      data: depositOptions.map(depositOption => ({
        depositOptionID: depositOption.id,
        depositOptionName: depositOption.name,
        depositOptionDescription: depositOption.description,
        interestRate: parseFloat(depositOption.interestRate),
        term: depositOption.term,
      })),
    });
  } catch (error) {
    console.error("Error retrieving deposit options:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
