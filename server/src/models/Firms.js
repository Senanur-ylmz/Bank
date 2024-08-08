import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const Firm = sequelize.define('Firm', {
  company_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subscription_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_value: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unique_company_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  interest_rate_overdue_payment: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subscription_start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  subscription_end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

export default Firm;
