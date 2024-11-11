const followModel = require("../../models/follow");
const isAllowToSeePage = require("../../utils/isAllowToSeePage");

exports.showPageView = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const hasAccessToPage = await isAllowToSeePage(req.user._id, pageId);
    const followed = await followModel.findOne({
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
