const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Doctor = sequelize.define(
    'Doctor',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Doctor name cannot be empty' }
        }
      },
      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Specialization cannot be empty' }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          name: 'doctors_email_unique',
          msg: 'Doctor with this email already exists'
        },
        validate: {
          isEmail: { msg: 'Invalid email address' },
          notEmpty: { msg: 'Email cannot be empty' }
        }
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Phone number cannot be empty' }
        }
      },
      experienceYears: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: { args: [0], msg: 'Experience cannot be negative' }
        }
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      tableName: 'doctors',
      timestamps: true
    }
  );

  return Doctor;
};
