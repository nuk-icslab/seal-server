const { http_config } = require("./config");
const logger = require("./logger");
const ExpressServer = require("./expressServer");

const launchServer = async () => {
  try {
    this.expressServer = new ExpressServer(http_config.PORT);
    this.expressServer.launch();
    logger.info("Express server running");
  } catch (error) {
    logger.error("Express Server failure", error.message, error.stack);
    await this.expressServer.close();
  }
};

launchServer().catch((e) => logger.error(e));
