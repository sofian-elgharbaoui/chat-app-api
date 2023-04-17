const { StatusCodes } = require("http-status-codes");
const { BadRequestErr } = require("../errors/errors_index");
const User = require("../models/User");

const registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    occupation,
    location,
    email,
    password,
    picturePath,
  } = req.body;

  const inputsInfo = {
    firstName,
    lastName,
    occupation,
    location,
    email,
    password,
    picturePath,
  };

  if (!Object.values(inputsInfo).every((v) => v)) {
    throw new BadRequestErr("Please fill all the neccessary fields."); // I will mark them in the frontend
  }

  // remember, I must write User.create(), not just User()
  //(if I want to do that, then I should put the new keyword before User(), which refers to a new instance)
  await User.create(inputsInfo);
  res
    .status(StatusCodes.CREATED)
    .json({ status: "You have successfully registered" });
};

const loginUser = async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestErr("Please provide both your email & password.");
  }

  email = email.toLowerCase();
  let userInfo = await User.findOne({ email });
  if (!userInfo) {
    throw new BadRequestErr("There is no user with this email!");
  }
  // I noticed that just the person who has just regestered has the ability to login.
  let isPasswordCorrect = await userInfo.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestErr("You have passed the wrong password.");
  }

  let token = userInfo.createJWT();
  userInfo = userInfo.removePassword();
  res.status(StatusCodes.OK).json({ userInfo, token });
};

module.exports = { registerUser, loginUser };
