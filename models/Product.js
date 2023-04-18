const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    firstName: String,
    lastName: String,
    location: String,
    userPicturePath: String,
    description: { type: String, default: "" },
    picturePath: { type: String, default: "" },
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    comments: {
      type: Array,
      default: [],
    },
    price: {
      type: String,
      required: true,
    },
    CLIENT_ID: {
      type: String,
      required: true,
    },
    CLIENT_SECRET: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
