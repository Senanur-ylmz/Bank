import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

const sequelize = new Sequelize('mysql://webadmin:1234@localhost:3306/webbank');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
      isAlpha: true
    }
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
      isAlpha: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      len: [1, 100]
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100]
    }
  },
  role: {
    type: DataTypes.ENUM('User', 'Admin'),
    defaultValue: 'User'
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
  hooks: {
    beforeCreate: async (user) => {
      try {
        if (user.password) {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.password = hashedPassword;
        }
      } catch (error) {
        throw new Error(error);
      }
    }
  }
});

User.prototype.comparePassword = async function (password) {
  console.log(this.password);
  return await bcrypt.compare(password, this.password);
};




export default User;
