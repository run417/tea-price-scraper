const express = require("express");
const morgan = require("morgan");
const middleware = require("./utils/middleware");
const teaDataRouter = require("./controllers/tea");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use("/api/prices/tea", teaDataRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
