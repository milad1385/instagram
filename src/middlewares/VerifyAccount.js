module.exports = async (req, res, next) => {
  try {
    const isVerified = req.user.isVerified;

    if (!isVerified) {
      req.flash("verify", "Please verify your account");

      return res.render("post/create");
    }

    next();
  } catch (error) {
    next(error);
  }
};
