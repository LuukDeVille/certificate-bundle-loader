const winston = require('winston');
const loglevel = process.env.LOG_LEVEL || 'error' ;

const logger = winston.createLogger({
  level: loglevel,
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()]
});

module.exports = logger;
