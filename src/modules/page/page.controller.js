const { isValidObjectId } = require("mongoose");
const FollowModel = require("../../models/follow");
const UserModel = require("../../models/User");
const isAllowToSeePage = require("../../utils/isAllowToSeePage");

exports.showPageView = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const hasAccessToPage = await isAllowToSeePage(req.user._id, pageId);
    const followed = await FollowModel.findOne({
      follower: req.user._id,
      following: pageId,
    });

    if (!hasAccessToPage) {
      req.flash("error", "This page is private !!!");
      return res.render("page/profile", {
        followed: Boolean(followed),
        pageId,
      });
    }

    return res.render("page/profile", {
      followed: Boolean(followed),
      pageId,
    });
  } catch (error) {
    next(error);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const { pageId } = req.params;

    if (!isValidObjectId(pageId)) {
      req.flash("error", "page id is not valid");
      return res.redirect("/");
    }

    const page = await UserModel.findOne({ _id: pageId });

    if (!page) {
      req.flash("error", "page not found :(");
      return res.redirect("/");
    }

    const existFollowing = await FollowModel.findOne({
      follower: req.user._id,
      following: pageId,
    });

    if (existFollowing) {
      req.flash("error", "You have followed this user");
      return res.redirect(`/page/${pageId}`);
    }

    await FollowModel.create({
      follower: req.user._id,
      following: pageId,
    });

    req.flash("success", "follow user successfully :)");
    return res.redirect(`/page/${pageId}`);
  } catch (error) {
    next(error);
  }
};

