const crypto = require('crypto');

function generateShortcode(length = 6) {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

module.exports = generateShortcode;