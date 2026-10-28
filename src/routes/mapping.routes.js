const express = require('express');
const router = express.Router();
const mappingController = require('../controllers/mapping.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
  mappingCreateValidation,
  idParamValidation,
  patientIdParamValidation
} = require('../middleware/validation.middleware');

// All mapping endpoints require authentication
router.use(authenticate);

// POST /api/mappings/ - Assign a doctor to a patient
router.post('/', mappingCreateValidation, mappingController.createMapping);

// GET /api/mappings/ - Retrieve all patient-doctor mappings
router.get('/', mappingController.getAllMappings);

// GET /api/mappings/:patientId/ - Get all doctors assigned to a specific patient
router.get('/:patientId', patientIdParamValidation, mappingController.getDoctorsByPatientId);

// DELETE /api/mappings/:id/ - Remove a doctor from a patient
router.delete('/:id', idParamValidation, mappingController.deleteMapping);

module.exports = router;
