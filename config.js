const path = require("path");

const config = {
  ROOT_DIR: __dirname,
  URL_PORT: 8080,
  URL_PATH: "https://example.com",
  BASE_VERSION: "/ss-gm/v1",
  CONTROLLER_DIRECTORY: path.join(__dirname, "controllers"),
  PROJECT_DIR: __dirname,
  PENAPI_YAML: path.join(config.ROOT_DIR, "api", "openapi.yaml"),
  FULL_PATH: `${config.URL_PATH}:${config.URL_PORT}/${config.BASE_VERSION}`,
  FILE_UPLOAD_PATH: path.join(config.PROJECT_DIR, "uploaded_files"),
};

module.exports = config;
