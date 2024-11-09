const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    following: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Follow", schema);

module.exports = model;
