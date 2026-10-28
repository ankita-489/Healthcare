const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', routes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Healthcare Backend API',
    documentation: '/api/health',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register/',
        login: 'POST /api/auth/login/'
      },
      patients: {
        create: 'POST /api/patients/',
        list: 'GET /api/patients/',
        get: 'GET /api/patients/:id/',
        update: 'PUT /api/patients/:id/',
        delete: 'DELETE /api/patients/:id/'
      },
      doctors: {
        create: 'POST /api/doctors/',
        list: 'GET /api/doctors/',
        get: 'GET /api/doctors/:id/',
        update: 'PUT /api/doctors/:id/',
        delete: 'DELETE /api/doctors/:id/'
      },
      mappings: {
        create: 'POST /api/mappings/',
        list: 'GET /api/mappings/',
        byPatient: 'GET /api/mappings/:patientId/',
        delete: 'DELETE /api/mappings/:id/'
      }
    }
  });
});

// 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
