// models/CurrencyRate.js

import { DataTypes, Sequelize } from 'sequelize';
const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const CurrencyRate = sequelize.define('CurrencyRate', {
    CurrencyCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    SaleRate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    PurchaseRate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    ChangeAmount: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    ChangeRate: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false
    },
    ChangeDirection: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('now')
      }
  }, {
    timestamps: true,
    tableName: 'currencyrates'
  });
  
  export default CurrencyRate;