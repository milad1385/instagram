const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expireTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("ResetPassword", schema);

module.exports = model;
