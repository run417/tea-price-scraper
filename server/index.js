const http = require("http");
const logger = require("./utils/logger");
const app = require("./app");
const config = require("./utils/config");

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`server listening on port ${config.PORT}`);
});
