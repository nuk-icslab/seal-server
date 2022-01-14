const { http_config, db_config } = require("./config");
const logger = require("./logger");
const ExpressServer = require("./expressServer");
const mongoose = require("mongoose");

const launchServer = async () => {
  mongoose
    .connect(db_config.URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .catch((error) =>
      logger.error("[MongoDB] Failed connecting database ", error)
    );
  try {
    this.expressServer = new ExpressServer(http_config);
    this.expressServer.launch();
    logger.info("[Express] Server is running");
  } catch (error) {
    logger.error("[Express] Server failure ", error.message, error.stack);
    await this.expressServer.close();
  }
};

launchServer().catch((e) => logger.error(e));
