const https = require("https");
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
const { capifAef } = require("capif-aef");
const { oapi_config, oidc_config } = require("./config");
const { group_getByUserId } = require("./services/GroupManagementService");

class ExpressServer {
  constructor(http_config) {
    this.http_config = http_config;
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
    this.app.use(capifAef("aef-seal"));

    const oidc = new Provider(`${this.http_config.URI}`, oidc_config);
    oidc.use(async (ctx, next) => {
      logger.info(`[SEAL][IM-S] ${ctx.method} ${ctx.originalUrl}`);
      await next();
    });
    this.app.use("/oidc", oidc.callback());
    this.app.use(bodyParser.json({ limit: "14MB" }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.get("/", (req, res) => {
      res.json({ succeed: true, description: "Welcome to the SEAL Server" });
    });

    // Hard coded special endpoint
    this.app.get("/custom-gm/groups/:user_id", group_getByUserId);
  }

  launch() {
    this.setupMiddleware();
    new OpenApiValidator({
      apiSpec: oapi_config.OPENAPI_YAML,
      operationHandlers: path.join(oapi_config.PROJECT_DIR),
      validateRequests: false,
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

        let server = {};
        if (this.http_config.PROTO === "https") {
          const key = fs.readFileSync(this.http_config.KEY_PATH);
          const cert = fs.readFileSync(this.http_config.CERT_PATH);
          const https_credentials = { key, cert };
          https.globalAgent.on("keylog", (line, tlsSocket) => {
            console.log(line);
            fs.appendFileSync(this.http_config.KEYLOG_PATH, line, {
              mode: 0o600,
            });
          });
          server = https.createServer(https_credentials, this.app);
        } else {
          server = http.createServer(this.app);
        }

        server.listen(this.http_config.PORT, this.http_config.IP_ADDR);
        logger.info(
          "[Express] Listening on " +
          `${this.http_config.PROTO}://${this.http_config.IP_ADDR}:${this.http_config.PORT}`
        );
      });
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      logger.info(`[Express] Server on ${this.http_config.URI} shut down`);
    }
  }
}

module.exports = ExpressServer;
