const http = require("http");
const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { OpenApiValidator } = require("express-openapi-validator");
const logger = require("./logger");
const config = require("./config");

class ExpressServer {
  constructor(port, openApiYaml) {
    this.port = port;
    this.app = express();
    this.openApiPath = openApiYaml;
    try {
      this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
    } catch (e) {
      logger.error("failed to start Express Server", e.message);
    }
    this.setupMiddleware();
  }

  setupMiddleware() {
    // this.setupAllowedMedia();
    this.app.use(cors());
    this.app.use(bodyParser.json({ limit: "14MB" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  launch() {
    new OpenApiValidator({
      apiSpec: this.openApiPath,
      operationHandlers: path.join(config.PROJECT_DIR),
    })
      .install(this.app)
      .catch((e) => console.log(e))
      .then(() => {
        // eslint-disable-next-line no-unused-vars
        this.app.use((err, req, res, next) => {
          // format errors
          res.status(err.status || 500).json({
            message: err.message || err,
            errors: err.errors || "",
          });
        });

        http.createServer(this.app).listen(this.port);
        logger.info(`Listening on port ${this.port}`);
      });
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      logger.info(`Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
