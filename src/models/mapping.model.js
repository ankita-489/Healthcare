const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PatientDoctorMapping = sequelize.define(
    'PatientDoctorMapping',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'doctors',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      assignedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'patient_doctor_mappings',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['patientId', 'doctorId'],
          name: 'unique_patient_doctor_mapping'
        }
      ]
    }
  );

  return PatientDoctorMapping;
};
