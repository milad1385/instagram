exports.showHomePage = async (req, res, next) => {
  try {
    const user = req.user;
    return res.render("index", { user });
  } catch (error) {
    next(error);
  }
};
