const { PatientDoctorMapping, Patient, Doctor } = require('../models');

// POST /api/mappings/ - Assign a doctor to a patient
const createMapping = async (req, res, next) => {
  try {
    const { patientId, doctorId, notes } = req.body;

    // Check if patient exists
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found`
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${doctorId} not found`
      });
    }

    // Check if mapping already exists
    const existingMapping = await PatientDoctorMapping.findOne({
      where: { patientId, doctorId }
    });

    if (existingMapping) {
      return res.status(409).json({
        success: false,
        message: 'This doctor is already assigned to this patient'
      });
    }

    const mapping = await PatientDoctorMapping.create({
      patientId,
      doctorId,
      notes: notes || null
    });

    const populatedMapping = await PatientDoctorMapping.findByPk(mapping.id, {
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name', 'contact', 'gender', 'age'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization', 'email', 'phone'] }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Doctor assigned to patient successfully',
      mapping: populatedMapping
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/mappings/ - Retrieve all patient-doctor mappings
const getAllMappings = async (req, res, next) => {
  try {
    const mappings = await PatientDoctorMapping.findAll({
      include: [
        { model: Patient, as: 'patient', attributes: ['id', 'name', 'contact', 'gender', 'age'] },
        { model: Doctor, as: 'doctor', attributes: ['id', 'name', 'specialization', 'email', 'phone'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: mappings.length,
      mappings
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/mappings/:patientId/ - Get all doctors assigned to a specific patient
const getDoctorsByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found`
      });
    }

    const mappings = await PatientDoctorMapping.findAll({
      where: { patientId },
      include: [
        {
          model: Doctor,
          as: 'doctor'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const doctors = mappings.map((m) => ({
      mappingId: m.id,
      notes: m.notes,
      assignedDate: m.assignedDate,
      ...m.doctor.toJSON()
    }));

    res.status(200).json({
      success: true,
      patientId: Number(patientId),
      patientName: patient.name,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/mappings/:id/ - Remove a doctor from a patient
const deleteMapping = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mapping = await PatientDoctorMapping.findByPk(id);
    if (!mapping) {
      return res.status(404).json({
        success: false,
        message: 'Patient-Doctor mapping record not found'
      });
    }

    await mapping.destroy();

    res.status(200).json({
      success: true,
      message: 'Doctor removed from patient successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMapping,
  getAllMappings,
  getDoctorsByPatientId,
  deleteMapping
};
