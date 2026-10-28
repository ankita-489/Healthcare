const { Patient, Doctor, PatientDoctorMapping } = require('../models');

// POST /api/patients/ - Add a new patient (Authenticated users only)
const createPatient = async (req, res, next) => {
  try {
    const { name, age, gender, contact, address, medicalHistory } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      medicalHistory,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/ - Retrieve all patients created by the authenticated user
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctors',
          through: { attributes: ['id', 'notes', 'assignedDate'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/patients/:id/ - Get details of a specific patient
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Doctor,
          as: 'doctors',
          through: { attributes: ['id', 'notes', 'assignedDate'] }
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      patient
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/patients/:id/ - Update patient details
const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, age, gender, contact, address, medicalHistory } = req.body;

    const patient = await Patient.findOne({
      where: { id, userId: req.user.id }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or you do not have permission to update it'
      });
    }

    await patient.update({
      name: name !== undefined ? name : patient.name,
      age: age !== undefined ? age : patient.age,
      gender: gender !== undefined ? gender : patient.gender,
      contact: contact !== undefined ? contact : patient.contact,
      address: address !== undefined ? address : patient.address,
      medicalHistory: medicalHistory !== undefined ? medicalHistory : patient.medicalHistory
    });

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      patient
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/patients/:id/ - Delete a patient record
const deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      where: { id, userId: req.user.id }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or you do not have permission to delete it'
      });
    }

    await patient.destroy();

    res.status(200).json({
      success: true,
      message: 'Patient record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
};
