const { StatusCodes } = require("http-status-codes");
const { BadRequestErr } = require("../errors/errors_index");
const Product = require("../models/Product");
const User = require("../models/User");

const getProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  res.status(StatusCodes.OK).json({ product });
};

const getFeedProducts = async (req, res) => {
  const allProducts = await Product.find();
  res.status(StatusCodes.OK).json({ allProducts });
};

const getUserProducts = async (req, res) => {
  const { id } = req.params;
  // to sort a result in a reversed order, add "-" before the property name.
  const userProducts = await Product.find({ createdBy: id });
  // .sort("-updatedAt");
  res.status(StatusCodes.OK).json({ userProducts });
};

const createProduct = async (req, res) => {
  const { id } = req.params;
  const { picturePath, description, price } = req.body;

  const user = await User.findById(id).select(
    "_id firstName lastName location picturePath CLIENT_ID CLIENT_SECRET"
  );
  const productInfo = new Product({
    createdBy: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
    userPicturePath: user.picturePath,
  });

  if (!price) throw new BadRequestErr("Please, put the price product price.");
  else productInfo.price = price;

  if (!user.CLIENT_ID || !user.CLIENT_SECRET) {
    throw new BadRequestErr(
      `Please, you must have the paypal client_id and secret. \n 
      go and change your profile data
      `
    );
    // provide a video from youtube to explain how to do that
  } else {
    productInfo.CLIENT_ID = user.CLIENT_ID;
    productInfo.CLIENT_SECRET = user.CLIENT_SECRET;
  }

  if (!description && !picturePath) {
    throw new BadRequestErr(
      "Please, at least provide either the description or picture."
    );
  } else {
    if (description) {
      productInfo.description = description;
    }
    if (picturePath) {
      productInfo.picturePath = picturePath;
    }
  }

  await productInfo.save();
  const allProducts = await Product.find();
  res.status(StatusCodes.CREATED).json({ allProducts });
};

const likeProduct = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;
  const productInfo = await Product.findById(productId).select("likes");

  if (productInfo.likes.has(id)) productInfo.likes.delete(id);
  else productInfo.likes.set(id, true);

  await Product.findByIdAndUpdate(productId, {
    likes: productInfo.likes,
  });

  const allPosts = await Product.find();
  res.status(StatusCodes.OK).json({ allPosts });
};

const commentOnProduct = async (req, res) => {
  const { productId, comment } = req.body;
  const productInfo = await Product.findById(productId).select("comments");

  productInfo.comments.push(comment);

  const updatedPost = await Product.findByIdAndUpdate(
    productId,
    { comments: productInfo.comments },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ updatedPost });
};

module.exports = {
  getProduct,
  getFeedProducts,
  getUserProducts,
  createProduct,
  likeProduct,
  commentOnProduct,
};
