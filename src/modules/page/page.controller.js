exports.showPageView = async (req, res, next) => {
  try {
    return res.render("page/profile");
  } catch (error) {
    next(error);
  }
};

