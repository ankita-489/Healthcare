const { Doctor, Patient } = require('../models');

// POST /api/doctors/ - Add a new doctor (Authenticated users only)
const createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, email, phone, experienceYears } = req.body;

    const existingDoctor = await Doctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'A doctor with this email already exists'
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      email,
      phone,
      experienceYears: experienceYears || 0,
      userId: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/ - Retrieve all doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: Patient,
          as: 'patients',
          through: { attributes: ['id', 'notes', 'assignedDate'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/doctors/:id/ - Get details of a specific doctor
const getDoctorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [
        {
          model: Patient,
          as: 'patients',
          through: { attributes: ['id', 'notes', 'assignedDate'] }
        }
      ]
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/doctors/:id/ - Update doctor details
const updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, specialization, email, phone, experienceYears } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (email && email !== doctor.email) {
      const emailInUse = await Doctor.findOne({ where: { email } });
      if (emailInUse) {
        return res.status(409).json({
          success: false,
          message: 'Another doctor already uses this email address'
        });
      }
    }

    await doctor.update({
      name: name !== undefined ? name : doctor.name,
      specialization: specialization !== undefined ? specialization : doctor.specialization,
      email: email !== undefined ? email : doctor.email,
      phone: phone !== undefined ? phone : doctor.phone,
      experienceYears: experienceYears !== undefined ? experienceYears : doctor.experienceYears
    });

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      doctor
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/doctors/:id/ - Delete a doctor record
const deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    await doctor.destroy();

    res.status(200).json({
      success: true,
      message: 'Doctor record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
