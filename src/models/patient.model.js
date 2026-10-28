const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Patient = sequelize.define(
    'Patient',
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
          notEmpty: { msg: 'Patient name cannot be empty' }
        }
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: 'Age must be an integer' },
          min: { args: [0], msg: 'Age cannot be negative' },
          max: { args: [150], msg: 'Age is out of realistic range' }
        }
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: {
            args: [['Male', 'Female', 'Other', 'male', 'female', 'other']],
            msg: 'Gender must be Male, Female, or Other'
          }
        }
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Contact number cannot be empty' }
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      medicalHistory: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    },
    {
      tableName: 'patients',
      timestamps: true
    }
  );

  return Patient;
};
