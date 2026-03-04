const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const path = require('path')

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ecommerce API",
      version: "1.0.0",
      description: "API documentation for Ecommerce Backend"
    },
    servers: [
      {
        url: "http://localhost:3000",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

const specs = swaggerJsdoc(options)
console.log("Swagger loaded files:", options.apis)

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
  app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(specs)
      })
}