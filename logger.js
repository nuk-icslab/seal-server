const { transports, createLogger, format } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.simple()),
  defaultMeta: {},
  transports: [new transports.Console()],
});

module.exports = logger;
