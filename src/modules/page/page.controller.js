const isAllowToSeePage = require("../../utils/isAllowToSeePage");

exports.showPageView = async (req, res, next) => {
  try {
    const { pageId } = req.params;
    const hasAccessToPage = await isAllowToSeePage(req.user._id, pageId);

    if (hasAccessToPage) {
      return res.render("page/profile");
    } else {
      req.flash("error", "This page is private !!!");
      return res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
};
