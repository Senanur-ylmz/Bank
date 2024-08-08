import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const Transaction = sequelize.define('Transaction', {
  transactionID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  senderAccountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Account',
      key: 'accountID'
    }
  },
  receiverAccountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  transactionType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  transactionDate: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  timestamps: false
});

export default Transaction;
