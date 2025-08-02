const { v4: uuidv4 } = require('uuid');

module.exports = function LoggingMiddleware(req, res, next) {
  const logEntry = {
    logID: uuidv4(),
    message: 'log created successfully',
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  };
  req.log = logEntry;
  next();
};