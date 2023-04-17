const { StatusCodes } = require("http-status-codes");

class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

class UnauthenticatedErr extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = { BadRequestErr, UnauthenticatedErr };
