// models/Altin.js

import { DataTypes, Sequelize } from 'sequelize';
const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const Altin = sequelize.define('Altin', {
  altin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  gram_altin_miktari: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  alis_fiyati: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  satis_fiyati: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tarih: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

export default Altin;

