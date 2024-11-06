const UserModel = require("../../models/User");
const { registerValidationSchema } = require("./auth.validator");
const jwt = require("jsonwebtoken");

exports.getAndShowRegister = async (req, res, next) => {
  try {
    return res.render("auth/register");
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, username, name, password } = req.body;

    await registerValidationSchema(req.body);

    const isUserExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      req.flash("error", "This user is exsit already ");
      return res.render("/auth/register");
    }

    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const usersCount = await UserModel.countDocuments({});

    await UserModel.create({
      name,
      username,
      email,
      role: usersCount === 0 ? "ADMIN" : "USER",
    });

    req.flash("success", "Sign up successfully :)");
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 90_000,
    });
    return res.render("/auth/register");
  } catch (error) {
    next(error);
  }
};
