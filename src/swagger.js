// swagger.js
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        url: 'http://localhost:2000/api-docs',
      },
    ],
    components: {
      schemas: {
        Quote: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              format: 'int64'
            },
            // ... other quote properties
          }
        }
      }
    },
  },
  apis: ['./src/routes/*.js'
  ] // Files containing Swagger annotations
};

const specs = swaggerJsDoc(options);

export default specs
