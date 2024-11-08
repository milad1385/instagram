const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
module.exports = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;


    if (!accessToken) {
      req.flash("error", "Please sign in ...");
      return res.redirect("/auth/login");
    }

    const payload = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (!payload) {
      req.flash("error", "Please sign in ...");
      return res.redirect("/auth/login");
    }

    const user = await UserModel.findOne({ email: payload.email });

    if (!user) {
      req.flash("error", "Please sign in ...");
      return res.redirect("/auth/login");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
