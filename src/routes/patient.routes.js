const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
  patientCreateValidation,
  patientUpdateValidation,
  idParamValidation
} = require('../middleware/validation.middleware');

// All patient management routes require authentication
router.use(authenticate);

// POST /api/patients/ - Add a new patient
router.post('/', patientCreateValidation, patientController.createPatient);

// GET /api/patients/ - Retrieve all patients created by the authenticated user
router.get('/', patientController.getAllPatients);

// GET /api/patients/:id/ - Get details of a specific patient
router.get('/:id', idParamValidation, patientController.getPatientById);

// PUT /api/patients/:id/ - Update patient details
router.put('/:id', patientUpdateValidation, patientController.updatePatient);

// DELETE /api/patients/:id/ - Delete a patient record
router.delete('/:id', idParamValidation, patientController.deletePatient);

module.exports = router;
