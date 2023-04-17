const { StatusCodes } = require("http-status-codes");
const { BadRequestErr } = require("../errors/errors_index");
const Post = require("../models/Post");
const User = require("../models/User");

const getPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);
  res.status(StatusCodes.OK).json({ post });
};

const getFeedPosts = async (req, res) => {
  const allPosts = await Post.find();
  res.status(StatusCodes.OK).json({ allPosts });
};

const getUserPosts = async (req, res) => {
  const { id } = req.params;
  // to sort a result in a reversed order, add "-" before the property name.
  const userPosts = await Post.find({ createdBy: id });
  // .sort("-updatedAt");
  res.status(StatusCodes.OK).json({ userPosts });
};

const createPost = async (req, res) => {
  const { id } = req.params;
  const { picturePath, description } = req.body;

  const user = await User.findById(id).select(
    "_id firstName lastName location picturePath"
  );
  const postInfo = new Post({
    createdBy: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    userPicturePath: user.picturePath,
  });
  if (!description && !picturePath) {
    throw new BadRequestErr(
      "Please, at least provide either the description or picture."
    );
  } else {
    if (description) {
      postInfo.description = description;
    }
    if (picturePath) {
      postInfo.picturePath = picturePath;
    }
  }

  await postInfo.save();
  const allPosts = await Post.find();
  res.status(StatusCodes.CREATED).json({ allPosts });
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const { postId } = req.body;
  const postInfo = await Post.findById(postId).select("likes");

  if (postInfo.likes.has(id)) postInfo.likes.delete(id);
  else postInfo.likes.set(id, true);

  await Post.findByIdAndUpdate(postId, {
    likes: postInfo.likes,
  });

  const allPosts = await Post.find();
  res.status(StatusCodes.OK).json({ allPosts });
};

const commentOnPost = async (req, res) => {
  const { postId, comment } = req.body;
  const postInfo = await Post.findById(postId).select("comments");

  postInfo.comments.push(comment);

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { comments: postInfo.comments },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ updatedPost });
};

module.exports = {
  getPost,
  getFeedPosts,
  getUserPosts,
  createPost,
  likePost,
  commentOnPost,
};
