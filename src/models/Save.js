const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Save", schema);

module.exports = model;
