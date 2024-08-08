import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const Invoices = sequelize.define('Invoices', {
  invoiceID: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    references: {
      model: 'Account',
      key: 'accountID'
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('now'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  transactionType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50]
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  invoiceDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

export default Invoices;
