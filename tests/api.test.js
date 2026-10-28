const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Healthcare Backend API Integration Tests', () => {
  let authToken;
  let userId;
  let testPatientId;
  let testDoctorId;
  let testMappingId;

  const testUser = {
    name: 'Dr. Jane Admin',
    email: `tester_${Date.now()}@example.com`,
    password: 'Password123!'
  };

  beforeAll(async () => {
    // Sync models
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('1. Authentication APIs', () => {
    it('POST /api/auth/register/ - should successfully register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
      userId = res.body.user.id;
    });

    it('POST /api/auth/register/ - should reject duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('POST /api/auth/register/ - should reject registration with invalid fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: '', email: 'invalid-email', password: '123' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('POST /api/auth/login/ - should successfully log in and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      authToken = res.body.token;
    });

    it('POST /api/auth/login/ - should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('2. Patient Management APIs', () => {
    it('POST /api/patients/ - should reject request without auth token', async () => {
      const res = await request(app)
        .post('/api/patients')
        .send({
          name: 'John Doe',
          age: 35,
          gender: 'Male',
          contact: '+1234567890'
        });

      expect(res.status).toBe(401);
    });

    it('POST /api/patients/ - should create a new patient when authenticated', async () => {
      const res = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Doe',
          age: 35,
          gender: 'Male',
          contact: '+1234567890',
          address: '123 Healthcare Ave, NY',
          medicalHistory: 'Hypertension'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.patient).toBeDefined();
      expect(res.body.patient.name).toBe('John Doe');
      testPatientId = res.body.patient.id;
    });

    it('GET /api/patients/ - should retrieve all patients for authenticated user', async () => {
      const res = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.patients)).toBe(true);
      expect(res.body.patients.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/patients/:id/ - should get details of a specific patient', async () => {
      const res = await request(app)
        .get(`/api/patients/${testPatientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.patient.id).toBe(testPatientId);
    });

    it('PUT /api/patients/:id/ - should update patient details', async () => {
      const res = await request(app)
        .put(`/api/patients/${testPatientId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          age: 36,
          medicalHistory: 'Hypertension, Mild Asthma'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.patient.age).toBe(36);
      expect(res.body.patient.medicalHistory).toBe('Hypertension, Mild Asthma');
    });
  });

  describe('3. Doctor Management APIs', () => {
    it('POST /api/doctors/ - should create a new doctor when authenticated', async () => {
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Dr. Gregory House',
          specialization: 'Diagnostic Medicine',
          email: 'house@princetonplainsboro.com',
          phone: '+15551234567',
          experienceYears: 20
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.doctor).toBeDefined();
      expect(res.body.doctor.name).toBe('Dr. Gregory House');
      testDoctorId = res.body.doctor.id;
    });

    it('POST /api/doctors/ - should reject duplicate doctor email', async () => {
      const res = await request(app)
        .post('/api/doctors')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Dr. Gregory Duplicate',
          specialization: 'Neurology',
          email: 'house@princetonplainsboro.com',
          phone: '+15559876543'
        });

      expect(res.status).toBe(409);
    });

    it('GET /api/doctors/ - should retrieve all doctors', async () => {
      const res = await request(app)
        .get('/api/doctors')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.doctors)).toBe(true);
      expect(res.body.doctors.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/doctors/:id/ - should get details of a specific doctor', async () => {
      const res = await request(app)
        .get(`/api/doctors/${testDoctorId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.doctor.id).toBe(testDoctorId);
    });

    it('PUT /api/doctors/:id/ - should update doctor details', async () => {
      const res = await request(app)
        .put(`/api/doctors/${testDoctorId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          experienceYears: 21
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.doctor.experienceYears).toBe(21);
    });
  });

  describe('4. Patient-Doctor Mapping APIs', () => {
    it('POST /api/mappings/ - should assign doctor to patient', async () => {
      const res = await request(app)
        .post('/api/mappings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          patientId: testPatientId,
          doctorId: testDoctorId,
          notes: 'Initial nephrology and diagnostic consultation'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.mapping).toBeDefined();
      expect(res.body.mapping.patientId).toBe(testPatientId);
      expect(res.body.mapping.doctorId).toBe(testDoctorId);
      testMappingId = res.body.mapping.id;
    });

    it('POST /api/mappings/ - should prevent duplicate assignment of same doctor to patient', async () => {
      const res = await request(app)
        .post('/api/mappings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          patientId: testPatientId,
          doctorId: testDoctorId
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('GET /api/mappings/ - should retrieve all patient-doctor mappings', async () => {
      const res = await request(app)
        .get('/api/mappings')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.mappings)).toBe(true);
      expect(res.body.mappings.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/mappings/:patientId/ - should get all doctors assigned to specific patient', async () => {
      const res = await request(app)
        .get(`/api/mappings/${testPatientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.patientId).toBe(testPatientId);
      expect(Array.isArray(res.body.doctors)).toBe(true);
      expect(res.body.doctors.length).toBe(1);
      expect(res.body.doctors[0].id).toBe(testDoctorId);
    });

    it('DELETE /api/mappings/:id/ - should remove doctor from patient', async () => {
      const res = await request(app)
        .delete(`/api/mappings/${testMappingId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('DELETE /api/mappings/:id/ - should return 404 for nonexistent mapping', async () => {
      const res = await request(app)
        .delete('/api/mappings/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('5. Clean-up & Cascade Deletions', () => {
    it('DELETE /api/patients/:id/ - should delete patient record', async () => {
      const res = await request(app)
        .delete(`/api/patients/${testPatientId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('DELETE /api/doctors/:id/ - should delete doctor record', async () => {
      const res = await request(app)
        .delete(`/api/doctors/${testDoctorId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
