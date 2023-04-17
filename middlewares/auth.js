const jwt = require("jsonwebtoken");
const { UnauthenticatedErr } = require("../errors/errors_index");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  try {
    const token = authHeader.split(" ")[1];
    // this is the most important step in this func
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.params.id = payload.id;
    next();
  } catch (e) {
    throw new UnauthenticatedErr("Please, try to register/login first.");
  }
};

module.exports = authMiddleware;
