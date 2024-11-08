const mongoose = require("mongoose");
const UUID = require("uuid");
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
      unique: true,
    },
    expire: {
      type: Date,
      reqired: true,
    },
  },
  { timestamps: true }
);

schema.statics.createToken = async (user) => {
  const expireDates = new Date() + 900_000;
  const token = UUID.v4();
  const createdToken = await model.create({
    user: user._id,
    expire: expireDates,
    token,
  });
  return token;
};

schema.statics.verifyToken = async (token) => {
  const refreshToken = await model.findOne({ token });

  if (refreshToken && refreshToken.expire >= Date.now()) {
    return refreshToken.token;
  }

  return false;
};



const model = mongoose.model("refreshToken", schema);

module.exports = model;
