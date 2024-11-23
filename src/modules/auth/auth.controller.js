const UserModel = require("../../models/User");
const { registerValidationSchema } = require("./auth.validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshTokenModel = require("./../../models/RefreshToken");
const ResetPasswordModel = require("../../models/ResetPassword");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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

    await registerValidationSchema.validate(req.body, { abortEarly: false });

    const isUserExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      req.flash("error", "This user is exsit already ");
      return res.redirect("/auth/register");
    }

    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    const usersCount = await UserModel.countDocuments({});

    const user = await UserModel.create({
      name,
      username,
      email,
      password,
      role: usersCount === 0 ? "ADMIN" : "USER",
    });

    const refreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 90_000_000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 90_000_000,
    });

    req.flash("success", "Sign up successfully :)");
    return res.redirect("/auth/register");
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await UserModel.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      req.flash("error", "Username or password is wrong");
      return res.redirect("/auth/login");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      req.flash("error", "Username or password is wrong");
      return res.redirect("/auth/login");
    }

    const refreshToken = await RefreshTokenModel.createToken(user);

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 90000000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 90000000,
    });

    req.flash("success", "Sign in successfully :)");
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

exports.getAndShowLogin = async (req, res, next) => {
  try {
    return res.render("auth/login");
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res.cookie("accessToken", "", {
      path: "/",
      maxAge: 0,
    });

    res.cookie("refreshToken", "", {
      path: "/",
      maxAge: 0,
    });

    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};

exports.showForgetPassword = async (req, res, next) => {
  try {
    return res.render("auth/forget-password");
  } catch (error) {
    next(error);
  }
};

exports.showResetPassword = async (req, res, next) => {
  try {
    return res.render("auth/reset-password");
  } catch (error) {
    next(error);
  }
};

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      req.flash("error", "user is not found");
      return res.redirect("back");
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expireTime = new Date().getTime() + 1000 * 60 * 60;
    console.log(user);

    await ResetPasswordModel.create({
      token,
      expireTime,
      user: user._id,
    });

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "miladsalami1385@gmail.com",
        pass: "oeaw bnuz ptdk gemi",
      },
    });

    const mailOptions = {
      from: "miladsalami1385@gmail.com",
      to: email,
      subject: "پشتیبانی سایت",
      html: `
      <h1>Hi , ${user.name}</h1> 
      <a href=http://localhost:4002/auth/reset-password?token=${token}>Click Here for reset email</a>
      `,
    };

    transport.sendMail(mailOptions);

    req.flash("success", "Email send successfully :)");
    return res.redirect("back");
  } catch (error) {
    console.log(error);

    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    console.log("req sended");
    
    console.log(token);

    if (!token) {
      req.flash("error", "token is not valid");
      return res.redirect("/forget-password");
    }

    const resetPassword = await ResetPasswordModel.findOne({ token });

    if (!resetPassword || resetPassword.expireTime < Date.now()) {
      req.flash("error", "token is not valid");
      return res.redirect("/forget-password");
    }

    const newPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate(
      { _id: resetPassword.user },
      {
        $set: {
          password: newPassword,
        },
      }
    );

    await ResetPasswordModel.findOneAndDelete({ token });

    req.flash("success", "new password set successfully :)");
    return res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
};
