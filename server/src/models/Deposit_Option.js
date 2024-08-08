import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const DepositOption = sequelize.define('DepositOption', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  interestRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  term: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  }
});


export default DepositOption;
