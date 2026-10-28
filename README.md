# Healthcare Backend API System

A secure, scalable RESTful backend service for a healthcare application built with **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize ORM**. The system manages user authentication, patient records, doctor profiles, and patient-to-doctor assignments.

---

## Features

- **Secure JWT Authentication**: User registration and login with JSON Web Tokens (`jsonwebtoken`) and salted password hashing using `bcryptjs`.
- **Role & Ownership Isolation**: Authenticated users manage their created patient and doctor records.
- **Relational Data Modeling with Sequelize ORM**:
  - `User`: Manages account credentials and permissions.
  - `Patient`: Stores patient demographics, medical history, and creator reference.
  - `Doctor`: Stores doctor credentials, specializations, and contact information.
  - `PatientDoctorMapping`: Many-to-many relationship tracking doctor assignments with clinical consultation notes.
- **Data Validation & Sanitization**: Strict input validation using `express-validator` to guarantee schema compliance and prevent injection attacks.
- **Centralized Error Handling**: Standardized JSON responses for validation errors, duplicate entries (409 Conflict), foreign key violations, and unhandled server exceptions.
- **Automated Testing Suite**: End-to-end integration tests using `Jest` and `Supertest`.
- **Postman Ready**: Pre-configured Postman Collection (`healthcare_api_collection.json`) included for instant API exploration.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Runtime** | Node.js (v18+) |
| **Framework** | Express.js |
| **Database** | PostgreSQL |
| **ORM** | Sequelize ORM |
| **Authentication** | JWT (`jsonwebtoken`) |
| **Hashing** | Bcrypt (`bcryptjs`) |
| **Validation** | Express-Validator |
| **Testing** | Jest + Supertest |

---

## Project Structure

```
Healthcare/
├── package.json                   # Dependencies & npm scripts
├── .env.example                   # Environment configuration template
├── .env                           # Local environment configuration
├── healthcare_api_collection.json # Postman collection (v2.1)
├── src/
│   ├── app.js                     # Express application configuration & routes mounting
│   ├── server.js                  # Database connection, model sync & server startup
│   ├── config/
│   │   └── database.js            # Sequelize PostgreSQL connection setup
│   ├── models/
│   │   ├── index.js               # Model definitions & relational associations
│   │   ├── user.model.js          # User model schema & password hashing hooks
│   │   ├── patient.model.js       # Patient model schema
│   │   ├── doctor.model.js        # Doctor model schema
│   │   └── mapping.model.js       # PatientDoctorMapping schema
│   ├── middleware/
│   │   ├── auth.middleware.js     # Bearer token verification middleware
│   │   ├── validation.middleware.js # Express-validator request sanitizers & rules
│   │   └── error.middleware.js    # Centralized 404 & error handlers
│   ├── controllers/
│   │   ├── auth.controller.js     # User registration & login handlers
│   │   ├── patient.controller.js  # Patient CRUD handlers
│   │   ├── doctor.controller.js   # Doctor CRUD handlers
│   │   └── mapping.controller.js  # Patient-Doctor assignment handlers
│   └── routes/
│       ├── index.js               # Main API router (/api)
│       ├── auth.routes.js         # /api/auth routes
│       ├── patient.routes.js      # /api/patients routes
│       ├── doctor.routes.js       # /api/doctors routes
│       └── mapping.routes.js      # /api/mappings routes
└── tests/
    └── api.test.js                # Integration test suite (23 test cases)
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (v14 or higher)

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
cd Healthcare
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and set your database credentials:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development

# PostgreSQL Connection
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=
DB_DIALECT=postgres

# Or use connection string:
# DATABASE_URL=postgres://postgres@127.0.0.1:5433/healthcare_db

# JWT Secret
JWT_SECRET=super_secret_healthcare_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=24h
```

### 4. Create the Database
Ensure PostgreSQL is running and create the database:
```bash
createdb -h 127.0.0.1 -p 5433 -U postgres healthcare_db
```

### 5. Running the Application
To run the server in development mode (with auto-reload):
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```
The server will start at `http://localhost:5000`.

---

## Running Automated Tests

Run the full integration test suite:
```bash
npm test
```
The test suite creates isolated schemas, executes tests against authentication, patients, doctors, and mappings endpoints, and tests cascade deletions.

---

## API Documentation

All protected endpoints require the following HTTP Header:
```
Authorization: Bearer <your_jwt_token>
```

### 1. Authentication APIs

#### Register User
- **POST** `/api/auth/register/`
- **Request Body:**
```json
{
  "name": "Dr. Jane Doe",
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Dr. Jane Doe",
    "email": "jane.doe@example.com",
    "createdAt": "2026-10-28T04:12:00.000Z"
  }
}
```

#### Log In User
- **POST** `/api/auth/login/`
- **Request Body:**
```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOi...",
  "user": {
    "id": 1,
    "name": "Dr. Jane Doe",
    "email": "jane.doe@example.com"
  }
}
```

---

### 2. Patient Management APIs

> All Patient endpoints require Bearer Token Authentication.

#### Add a New Patient
- **POST** `/api/patients/`
- **Request Body:**
```json
{
  "name": "Robert Smith",
  "age": 42,
  "gender": "Male",
  "contact": "+1-555-0199",
  "address": "742 Evergreen Terrace",
  "medicalHistory": "Type 2 Diabetes, Mild Hypertension"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "patient": {
    "id": 1,
    "name": "Robert Smith",
    "age": 42,
    "gender": "Male",
    "contact": "+1-555-0199",
    "address": "742 Evergreen Terrace",
    "medicalHistory": "Type 2 Diabetes, Mild Hypertension",
    "userId": 1,
    "createdAt": "2026-10-28T04:15:00.000Z"
  }
}
```

#### Retrieve All Patients
- **GET** `/api/patients/`
- Returns all patient records created by the authenticated user with assigned doctor details.
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "patients": [ ... ]
}
```

#### Get Patient Details
- **GET** `/api/patients/:id/`
- **Response (200 OK):**
```json
{
  "success": true,
  "patient": {
    "id": 1,
    "name": "Robert Smith",
    "age": 42,
    "gender": "Male",
    "doctors": [ ... ]
  }
}
```

#### Update Patient Details
- **PUT** `/api/patients/:id/`
- **Request Body (partial update supported):**
```json
{
  "age": 43,
  "medicalHistory": "Type 2 Diabetes, Controlled"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient updated successfully",
  "patient": { ... }
}
```

#### Delete a Patient Record
- **DELETE** `/api/patients/:id/`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Patient record deleted successfully"
}
```

---

### 3. Doctor Management APIs

> All Doctor endpoints require Bearer Token Authentication.

#### Add a New Doctor
- **POST** `/api/doctors/`
- **Request Body:**
```json
{
  "name": "Dr. Gregory House",
  "specialization": "Diagnostic Medicine",
  "email": "house@princetonplainsboro.com",
  "phone": "+1-555-0144",
  "experienceYears": 20
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Doctor added successfully",
  "doctor": {
    "id": 1,
    "name": "Dr. Gregory House",
    "specialization": "Diagnostic Medicine",
    "email": "house@princetonplainsboro.com",
    "phone": "+1-555-0144",
    "experienceYears": 20,
    "userId": 1
  }
}
```

#### Retrieve All Doctors
- **GET** `/api/doctors/`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "doctors": [ ... ]
}
```

#### Get Doctor Details
- **GET** `/api/doctors/:id/`
- **Response (200 OK):**
```json
{
  "success": true,
  "doctor": { ... }
}
```

#### Update Doctor Details
- **PUT** `/api/doctors/:id/`
- **Request Body:**
```json
{
  "experienceYears": 21,
  "phone": "+1-555-0145"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Doctor updated successfully",
  "doctor": { ... }
}
```

#### Delete a Doctor Record
- **DELETE** `/api/doctors/:id/`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Doctor record deleted successfully"
}
```

---

### 4. Patient-Doctor Mapping APIs

> All Mapping endpoints require Bearer Token Authentication.

#### Assign a Doctor to a Patient
- **POST** `/api/mappings/`
- **Request Body:**
```json
{
  "patientId": 1,
  "doctorId": 1,
  "notes": "Initial nephrology and diagnostic consultation"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Doctor assigned to patient successfully",
  "mapping": {
    "id": 1,
    "patientId": 1,
    "doctorId": 1,
    "notes": "Initial nephrology and diagnostic consultation",
    "assignedDate": "2026-10-28T04:20:00.000Z",
    "patient": {
      "id": 1,
      "name": "Robert Smith"
    },
    "doctor": {
      "id": 1,
      "name": "Dr. Gregory House",
      "specialization": "Diagnostic Medicine"
    }
  }
}
```

#### Retrieve All Mappings
- **GET** `/api/mappings/`
- **Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "mappings": [ ... ]
}
```

#### Get Doctors Assigned to a Specific Patient
- **GET** `/api/mappings/:patientId/`
- **Response (200 OK):**
```json
{
  "success": true,
  "patientId": 1,
  "patientName": "Robert Smith",
  "count": 1,
  "doctors": [
    {
      "mappingId": 1,
      "notes": "Initial nephrology and diagnostic consultation",
      "id": 1,
      "name": "Dr. Gregory House",
      "specialization": "Diagnostic Medicine",
      "email": "house@princetonplainsboro.com",
      "phone": "+1-555-0144"
    }
  ]
}
```

#### Remove a Doctor from a Patient
- **DELETE** `/api/mappings/:id/`
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Doctor removed from patient successfully"
}
```

---

## Postman Collection

Import `healthcare_api_collection.json` into Postman:
1. Open Postman -> Click **Import**.
2. Select `healthcare_api_collection.json` from the project root.
3. The collection is pre-configured with a test script on `Login User` that automatically sets the `token` variable on successful authentication.
