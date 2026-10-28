const { sequelize, testConnection } = require('../config/database');
const defineUser = require('./user.model');
const definePatient = require('./patient.model');
const defineDoctor = require('./doctor.model');
const defineMapping = require('./mapping.model');

const User = defineUser(sequelize);
const Patient = definePatient(sequelize);
const Doctor = defineDoctor(sequelize);
const PatientDoctorMapping = defineMapping(sequelize);

// User - Patient (One-to-Many: User creates Patients)
User.hasMany(Patient, { foreignKey: 'userId', as: 'patients', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// User - Doctor (One-to-Many: User adds Doctors)
User.hasMany(Doctor, { foreignKey: 'userId', as: 'createdDoctors', onDelete: 'SET NULL' });
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// Patient - Doctor (Many-to-Many through PatientDoctorMapping)
Patient.belongsToMany(Doctor, {
  through: PatientDoctorMapping,
  foreignKey: 'patientId',
  otherKey: 'doctorId',
  as: 'doctors'
});

Doctor.belongsToMany(Patient, {
  through: PatientDoctorMapping,
  foreignKey: 'doctorId',
  otherKey: 'patientId',
  as: 'patients'
});

// Direct associations for PatientDoctorMapping table
PatientDoctorMapping.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
PatientDoctorMapping.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

Patient.hasMany(PatientDoctorMapping, { foreignKey: 'patientId', as: 'mappings', onDelete: 'CASCADE' });
Doctor.hasMany(PatientDoctorMapping, { foreignKey: 'doctorId', as: 'mappings', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  testConnection,
  User,
  Patient,
  Doctor,
  PatientDoctorMapping
};
