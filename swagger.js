// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'A simple Express API application',
    },
    servers: [
      {
        url: 'http://localhost:2000/api',
      },
    ],
  },
  apis: ['./index.js'], // Files containing Swagger annotations
};

const specs = swaggerJsDoc(options);

module.exports = {
  swaggerUi,
  specs,
};
