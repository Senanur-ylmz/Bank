const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const Instruction = sequelize.define('Instruction', {
  userID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  recipient: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderAccountID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverAccountID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'quarterly', 'yearly'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
    allowNull: false
  }
});


export default Instruction;
