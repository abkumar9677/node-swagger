const express = require("express");

const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger.json");
const router = require("./src/routes/test");

const app = express();
app.use(express.json());
app.use(router);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

app.listen(3000, () => console.log("Example app listening on port 3000!"));
