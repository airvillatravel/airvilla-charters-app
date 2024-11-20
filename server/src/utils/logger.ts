import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info", // Minimum log level
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }), // Log stack traces
    format.splat(), // String interpolation
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // Colorize console output
        format.simple() // Simple format for console
      ),
    }),
  ],
});

export default logger;
