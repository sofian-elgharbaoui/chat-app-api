const mongoose = require("mongoose");

const connectDB = (uri) => {
  return new mongoose.connect(uri);
};

module.exports = connectDB;
