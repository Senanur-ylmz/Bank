import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const AccountType = sequelize.define('AccountType', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  deposit_term: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  minimum_deposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  interest_period: {
    type: DataTypes.STRING,
    allowNull: true
  },
  daily_withdrawal_limit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  withdrawal_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  minimum_balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  special_advantages: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  atm_usage_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  linked_check_account: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  transaction_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  exchange_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  foreign_currency_options: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  retirement_contributions: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  early_withdrawal_penalty: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  tax_benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default AccountType;
