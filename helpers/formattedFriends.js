const User = require("../models/User");

async function formattedFriends(userFriends) {
  if (!userFriends.length) return [];

  const friendsArr = await Promise.all(
    userFriends.map((friendID) => User.findById(friendID))
  );

  const formattedFriends = friendsArr.map(
    ({ _id, firstName, lastName, location, occupation, picturePath }) => {
      return { _id, firstName, lastName, location, occupation, picturePath };
    }
  );

  return formattedFriends;
}

module.exports = formattedFriends;
