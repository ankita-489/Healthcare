const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
  doctorCreateValidation,
  doctorUpdateValidation,
  idParamValidation
} = require('../middleware/validation.middleware');

// All doctor endpoints require authentication
router.use(authenticate);

// POST /api/doctors/ - Add a new doctor
router.post('/', doctorCreateValidation, doctorController.createDoctor);

// GET /api/doctors/ - Retrieve all doctors
router.get('/', doctorController.getAllDoctors);

// GET /api/doctors/:id/ - Get details of a specific doctor
router.get('/:id', idParamValidation, doctorController.getDoctorById);

// PUT /api/doctors/:id/ - Update doctor details
router.put('/:id', doctorUpdateValidation, doctorController.updateDoctor);

// DELETE /api/doctors/:id/ - Delete a doctor record
router.delete('/:id', idParamValidation, doctorController.deleteDoctor);

module.exports = router;
