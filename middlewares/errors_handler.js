const { StatusCodes } = require("http-status-codes");

const errorsHandler = (err, req, res, next) => {
  let customError = {
    // the current err is for the internal errors like hard coded validation.
    message: err.message || "Something broke!",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === "CastError") {
    customError.message = "You have passed the wrong user id.";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors).map((item) => item.message);
    customError.statusCode = StatusCodes.BAD_REQUEST;
  } else if (err.code === 11000) {
    customError.message = "This email address has been registered before.";
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(customError.statusCode).json({ message: customError.message });
};

module.exports = errorsHandler;
