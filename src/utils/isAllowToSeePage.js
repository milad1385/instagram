const UserModel = require("../models/User");
const FollowedModel = require("../models/follow");
module.exports = async (userId, pageId) => {
  if (userId === pageId) return true;

  const page = await UserModel.findOne({ _id: pageId });

  if (!page.private) return true;

  const followed = await FollowedModel.findOne({
    follower: userId,
    following: pageId,
  });

  if (!followed) return false;

  return true;
};
