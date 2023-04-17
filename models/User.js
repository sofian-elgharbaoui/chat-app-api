const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a valid first name."],
      minlength: [
        2,
        "The first name is shorter than the minimum allowed length (2).",
      ],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [
        2,
        "The last name is shorter than the minimum allowed length (2).",
      ],
    },
    friends: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Please provide a strong password."],
    },
    picturePath: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    occupation: {
      type: String,
      default: "",
    },
    viewedProfile: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// This method will run only if the user registered or modified his password
userSchema.pre("save", async function (next) {
  // I made this functionality to skip the re-hashing password in case I don't modify it.
  if (!this.isModified("password")) {
    return next();
  }

  this.firstName = this.firstName.toLowerCase();
  this.lastName = this.lastName.toLowerCase();
  this.email = this.email.toLowerCase();

  let salt = await bcrypt.genSalt();
  let hashedPassword = await bcrypt.hash(this.password, salt);
  //next time, don't forget to add the "await" keyword before the hash method and saltgen
  this.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  let isPasswordCorrect = await bcrypt.compare(password, this.password);
  return isPasswordCorrect;
};

userSchema.methods.createJWT = function () {
  // don't forget to use "this" keyword, and not the "userInfo" variable name.
  return jwt.sign(
    { id: this._id, lastName: this.lastName },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

userSchema.methods.removePassword = function () {
  let userInfoObj = this.toObject();
  // I used this because the delete keyword doesn't work on the returned
  // mongoDB obj, because it is not a plain Obj.
  delete userInfoObj.password;
  return userInfoObj;
};

// pay attention, don't add the "new" keyword before creating any model.
module.exports = mongoose.model("User", userSchema);
