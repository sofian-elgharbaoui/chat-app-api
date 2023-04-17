const { StatusCodes } = require("http-status-codes");
const { BadRequestErr } = require("../errors/errors_index");
const User = require("../models/User");
const formattedFriendsFn = require("../helpers/formattedFriends");

const getUser = async (req, res) => {
  const { id } = req.params;

  let userInfo = await User.findById(id).select("-password");
  if (!userInfo) {
    throw new BadRequestErr(`There is no user with this id: ${id}`);
  }

  userInfo.friends = await formattedFriendsFn(userInfo.friends);
  res.status(StatusCodes.OK).json({ userInfo });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, location, occupation } = req.body;
  let dataToUpdate = {};
  if (firstName) dataToUpdate.firstName = firstName;
  if (lastName) dataToUpdate.lastName = lastName;
  if (location) dataToUpdate.location = location;
  if (occupation) dataToUpdate.occupation = occupation;

  const userInfo = await User.findByIdAndUpdate(id, dataToUpdate, {
    new: true,
    runValidators: true,
  }).select("-password");
  if (!userInfo) {
    throw new BadRequestErr(`there is no user with this id: ${id}`);
  }

  res.status(StatusCodes.CREATED).json({ userInfo });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const userInfo = await User.findOne({ email });
  if (!userInfo) {
    throw new BadRequestErr("There is no user with this email!");
  }

  let isPasswordCorrect = await userInfo.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestErr("You have passed the wrong password!");
  }

  // remove the id from the all friends identifiers list
  userInfo.friends.forEach(async (friendID) => {
    let aFriend = await User.findById(friendID);
    aFriend.friends = aFriend.friends.filter((friendID) => friendID !== id);
    await aFriend.save();
  });

  await User.findByIdAndDelete(id);
  // the userInfo constant is keeping the info of that user inside it
  let fuleName = userInfo.firstName + " " + userInfo.lastName;
  res.status(StatusCodes.CREATED).json({ fuleName });
};

const getAllFriends = async (req, res) => {
  const { id } = req.params;

  const userInfo = await User.findById(id).select("friends");
  if (!userInfo) {
    throw new BadRequestErr(`there is no user with this id: ${id}`);
  }

  // this to return just what we need from the obj
  const formattedFriends = await formattedFriendsFn(userInfo.friends);
  res.status(StatusCodes.OK).json({ formattedFriends });
};

const addRemoveFriend = async (req, res) => {
  const { id, friendId } = req.params;

  const userInfo = await User.findById(id);
  if (!userInfo) {
    throw new BadRequestErr("There is no user with this id!");
  }
  const friendInfo = await User.findById(friendId);
  if (!friendInfo || friendId === id) {
    throw new BadRequestErr("There is no friend with this id!");
  }

  // to remove a friend from friends list
  if (userInfo.friends.includes(friendId)) {
    userInfo.friends = userInfo.friends.filter(
      (friendID) => friendID !== friendId
    );
    friendInfo.friends = friendInfo.friends.filter(
      (friendID) => friendID !== id
    );
    // to add a friend from friends list
  } else {
    userInfo.friends.push(friendId);
    friendInfo.friends.push(id);
  }
  // I think that the password get hashed another time here
  await userInfo.save();
  await friendInfo.save();
  let userFriends = userInfo.friends;
  res.status(StatusCodes.OK).json({ userFriends });
};

module.exports = {
  getUser,
  updateUser,
  deleteUser,
  addRemoveFriend,
  getAllFriends,
};
