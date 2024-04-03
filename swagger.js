const swaggerJsDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "This is a sample server for demonstration purposes.",
  },
  servers: [{ url: "http://localhost:3000" }],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/test.js"], // paths to your files
};

const swaggerSpec = swaggerJsDoc(options);
module.exports = swaggerSpec;
