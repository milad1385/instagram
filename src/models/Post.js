const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    media: {
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },

    hashtags: [String],
    user: {
      type: mongoose.Types.ObjectId,
      ref :"User",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("Post", schema);

module.exports = model;
