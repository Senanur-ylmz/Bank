import { DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const Account = sequelize.define('Account', {
  accountID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  userID: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  withdrawalAccountId: {
    type: DataTypes.INTEGER // Bu kısmı veri türüne göre ayarlayabilirsiniz
  },
  depositOption: {
    type: DataTypes.UUID,
    references: {
      model: 'Deposit_Option',
      key: 'id'
    }
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  accountType: {
    type: DataTypes.ENUM('Checking', 'Deposit'),
    allowNull: false
  },
  iban: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [1, 26]
    }
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  availableBalance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 3]
    }
  },
  openDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('now')
  }
});

// Middleware to generate unique accountID and IBAN
Account.beforeCreate(async (account, options) => {
  try {
    const newAccountID = await generateUniqueAccountID();
    account.accountID = newAccountID;
    account.iban = generateIBAN(newAccountID);
  } catch (error) {
    throw new Error(error);
  }
});

export async function generateUniqueAccountID() {
  const min = 1000000000000000;
  const max = 9999999999999999;
  let newAccountID;
  do {
    newAccountID = Math.floor(min + Math.random() * (max - min + 1));
  } while (!(await isAccountIDUnique(newAccountID)));
  return newAccountID;
}

export async function isAccountIDUnique(accountID) {
  const existingAccount = await Account.findOne({ where: { accountID: accountID }, attributes: { exclude: ['id', 'createdAt', 'updatedAt'] } });
  return !existingAccount;
}

export async function generateIBAN(accountID) {
  const countryCode = "TR";
  const controlDigits = "96";
  const bankCode = "12345";
  const reserveArea = "0";
  const newAccountID = await generateUniqueAccountID();
  const accountIDString = String(newAccountID).padStart(16, "0");
  return `${countryCode}${controlDigits}${bankCode}${reserveArea}${accountIDString}`;
}




export default Account;
