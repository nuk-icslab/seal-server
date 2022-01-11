const http = require("http");
const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { OpenApiValidator } = require("express-openapi-validator");
const { Provider } = require("oidc-provider");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./logger");
const { http_config, oapi_config, oidc_config } = require("./config");

class ExpressServer {
  constructor(port) {
    this.port = port;
    this.app = express();
    try {
      this.schema = jsYaml.safeLoad(fs.readFileSync(oapi_config.OPENAPI_YAML));
    } catch (e) {
      logger.error("failed to start Express Server", e.message);
    }
  }

  setupMiddleware() {
    //this.app.use(morgan("tiny"));
    this.app.use(cors());
    this.app.use(helmet());

    const oidc = new Provider(`${http_config.PATH}:${this.port}`, oidc_config);
    oidc.use(async (ctx, next) => {
      logger.info(`[SEAL][IM-S] ${ctx.method} ${ctx.originalUrl}`);
      await next();
    });
    this.app.use("/oidc", oidc.callback());
    this.app.use(bodyParser.json({ limit: "14MB" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }

  launch() {
    this.setupMiddleware();
    new OpenApiValidator({
      apiSpec: oapi_config.OPENAPI_YAML,
      operationHandlers: path.join(oapi_config.PROJECT_DIR),
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
        logger.info(`[Express] Listening on port ${this.port}`);
      });
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      logger.info(`[Express] Server on port ${this.port} shut down`);
    }
  }
}

module.exports = ExpressServer;
